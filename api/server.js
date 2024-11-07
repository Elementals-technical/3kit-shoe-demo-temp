import cors from "@koa/cors";
import Router from "@koa/router";
import http from "http";
import Koa from "koa";
import logger from "koa-logger";
import serve from "koa-static";
import mount from "koa-mount";
import { Server } from "socket.io";
import bodyParser from "koa-bodyparser";
import Rollbar from "rollbar";

import {
  openai,
  createNewThread,
  postNewMessageToThread,
  getAssistantId,
} from "./gpt.js";
import { ReadStream } from "fs";

new Rollbar({
  accessToken: "86273b2e8bf34f2c90d139030728c3ca",
  captureUncaught: true,
  captureUnhandledRejections: true,
  // environment: config.NODE_ENV,
});

// Create a Koa application
const app = new Koa();
const router = new Router();
app.use(bodyParser());
app.use(cors());
app.use(logger());

// Create an HTTP server and attach Koa app to it
const server = http.createServer(app.callback());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    // credentials: true,
  },
  pingTimeout: 72000000,
  pingInterval: 25000,
});

// Session storage (for demonstration purposes, use a proper session management system in production)
const sessions = {};

// unused now, and unexposed.
router.get("/api/health", async (ctx) => {
  ctx.body = "Hello, Koa with Socket.IO!";
});
router.get("/api/sessions", async (ctx) => {
  ctx.body = { sessions };
});

app.use(async (ctx, next) => {
  await next();
  if (ctx.path === "/shared") {
    if (ctx.body instanceof ReadStream) {
      const PUBLIC_TOKEN = "a7a07ea4-1614-4355-a681-b50d1e654081";
      const result = await (
        await fetch(
          `https://preview.threekit.com/api/configurations/${ctx.query.id}?bearer_token=${PUBLIC_TOKEN}&orgId=f20a5d56-ce82-4b88-9b71-f92b4b9616e6`
        )
      ).json();
      console.log("ctx", JSON.stringify(ctx, null, 2));
      const { snapshotUrl } = result.variant;

      // Read the stream into a string
      let content = "";
      ctx.body.setEncoding("utf8");
      for await (const chunk of ctx.body) {
        content += chunk;
      }

      content = content.replace(
        "https://preview.threekit.com/api/files/hash/sha256-426537ee2ecf294d033d0705e730175d0462ac3e21eec7a236e9738944cdade6",
        snapshotUrl
      );

      ctx.body = content;
      ctx.set("Content-Type", "text/html");
    }
  }
});
app.use(mount("/", serve("./dist")));
app.use(mount("/controller", serve("./dist", { index: "index.html" })));
app.use(mount("/shared", serve("./dist", { index: "index.html" })));

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle starting a session
  socket.on("startSession", (session, callback) => {
    console.log("on startSession", session);
    const { sessionId } = session;
    socket.join(sessionId);
    sessions[sessionId] = {
      sessionId,
      threadIdProm: createNewThread().then((thread) => thread.id),
      configuration: {},
    };
    console.log(`User ${socket.id} started session: ${sessionId}`);
  });

  socket.on("initProduct", (session, callback) => {
    console.log("on initProduct", session);

    if (session.sessionId in sessions === false) {
      socket.emit("connectionFailed", {
        error: `Invalid code. No remote session found with code '${session.sessionId}'.`,
      });
      return;
    }

    const { assetId, sessionId } = session;
    socket.join(sessionId);
    // sessions[sessionId] = { sessionId, assetId, configuration: {} };
    io.to(sessionId).emit("loadProduct", {
      sessionId,
      assetId,
    });
  });

  // Handle setting configuration in a specific session (chatroom)
  socket.on("postSendMessage", async (config) => {
    console.log("on postSendMessage", config);
    const { sessionId, message } = config;

    if (sessionId in sessions === false) return;

    io.to(sessionId).emit("postSendMessage", {
      sessionId,
      sender: socket.id,
      message,
    });

    const threadId = await sessions[sessionId].threadIdProm;
    await postNewMessageToThread(threadId, message);
    const assistantId = getAssistantId();

    // The response comes back as a stream of characters as the LLM builds,
    // so this can't be in a separate function if we want to emit
    // each update.
    const stream = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      stream: true,
    });

    let newConfig = "";
    let newChat = "";

    let gatherConfig = false;
    let gatherChat = false;

    try {
      for await (const event of stream) {
        switch (event.event) {
          case "thread.run.in_progress":
            // Assistant has started processing the current thread.
            console.log("New thread response in progress.");

            io.to(sessionId).emit("responseInProgress", {
              sessionId,
              sender: socket.id,
            });

            break;

          case "thread.message.delta":
            // Assistant has returned a new piece of the response.
            const s = event.data.delta.content[0].text.value;

            // When we see open brace, we start collecting the config.
            if (s.includes("{") && !gatherChat) gatherConfig = true;
            if (gatherConfig && !gatherChat) newConfig += s;

            // When we see closing brace, the config portion of the response is complete. Emit to viewer.
            if (s.includes("}") && !gatherChat) {
              newConfig = await JSON.parse(newConfig);
              console.log("Emitting new config:", newConfig);

              sessions[sessionId].configuration = newConfig;

              io.to(sessionId).emit("setConfiguration", {
                sessionId,
                configuration: sessions[sessionId].configuration,
                sender: socket.id,
                configurationPrompt: message,
              });

              gatherConfig = false;
              gatherChat = true;
            }

            if (!gatherConfig && gatherChat) newChat += s;

            // For each new piece of the chat, emit to viewer.
            // TO DO: EMIT TO CONTROLLER AS WELL.
            // if (gatherChat && !gatherConfig) {
            //   io.to(sessionId).emit("newChatPiece", {
            //     sessionId,
            //     piece: s,
            //     sender: socket.id,
            //   });
            // }

            break;

          case "thread.message.completed":
            // When the response message is complete, emit message to controller.
            console.log("Response message complete.");

            io.to(sessionId).emit("messageComplete", {
              sessionId,
              text: newChat.slice(newChat.indexOf("Text:") + 5),
              sender: socket.id,
            });

            gatherChat = false;

            break;

          default:
            break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("postSnapshot", (session) => {
    console.log("on postSnapshot", session);
    const { sessionId } = session;

    if (sessionId in sessions === false) return;

    io.to(sessionId).emit("snapshot", {
      sessionId,
      sender: socket.id,
      url: session.url,
    });
  });

  // Handle reset button functionality.
  socket.on("resetSession", (session, callback) => {
    console.log("on resetSession", session);
    const { sessionId } = session;

    sessions[sessionId] = {
      sessionId,
      threadIdProm: createNewThread().then((thread) => thread.id),
      configuration: {},
    };

    io.to(sessionId).emit("setConfiguration", {
      sessionId,
      configuration: sessions[sessionId].configuration,
      sender: socket.id,
      configurationPrompt: "",
    });

    io.to(sessionId).emit("messageComplete", {
      sessionId,
      text: "reset",
      sender: socket.id,
    });

    console.log(`socket started a new session: ${sessionId}`);
  });
});

io.of("/").adapter.on("delete-room", (room) => {
  console.log(`socket has deleted room ${room}`);
  delete sessions[room];
});

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3003;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.listen(8080);
