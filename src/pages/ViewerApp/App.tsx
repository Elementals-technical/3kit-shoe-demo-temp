import { useState, useEffect } from "react";
import Shoe from "./Fiber3D/Shoe";
import Canvas from "./Fiber3D/Canvas";
import { ThreekitInline, Threekit as ThreekitLogo } from "../../icons";
import {
  Wrapper,
  ThreekitLogoWrapper,
  OverlayHeader,
  SubHeader,
} from "./app.styles";
import { socket } from "../../socket";

import { generateSessionId, prepConfiguration } from "./utils";
import { ConnectionCode } from "./components/ConnectionCode";
import { ChatViewer } from "./components/ChatViewer";
import { PUBLIC_TOKEN } from "../../constants";

const sessionId = generateSessionId(); // unchanging

const defaultMessage = `What kind of color scheme would you like to get started? 
    If you're not sure, you can start by asking for a shoe 
    in your favourite colors, or with the theme of your sports 
    teams or even shoes to match your current fit.`;

const croppingCanvas = document.createElement("canvas");
croppingCanvas.width = 1200;
croppingCanvas.height = 900;

export default function App() {
  const [configuration, setConfiguration] = useState<any>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState(defaultMessage);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    console.log("emitting startSession");
    socket.emit("startSession", { sessionId });

    socket.on("loadProduct", (msg) => {
      console.log("socket says: loadProduct", msg);
      setIsLoaded(true);
    });

    socket.on("setConfiguration", (msg) => {
      console.log("socket says: setConfiguration", msg);
      const newConfig = prepConfiguration(msg.configuration);
      console.log(newConfig);
      setConfiguration({ ...configuration, ...newConfig });
    });

    socket.on("messageComplete", (newChat) => {
      console.log("Response complete.");
      if (newChat.text === "reset") setMessage(defaultMessage);
      else setMessage(newChat.text);
    });
  }, []);

  useEffect(() => {
    if (!canvas) return;
    const cb = async () => {
      const url = await crop(canvas, croppingCanvas);
      socket.emit("postSnapshot", {
        sessionId,
        url,
      });
    };
    socket.on("setConfiguration", cb);
    return () => {
      socket.off("setConfiguration", cb);
    };
  }, [canvas]);

  useEffect(() => {
    document.documentElement.style.cursor = "none";
  }, []);

  const [uiScale, setUiScale] = useState(1);
  const updateUiScale = () => {
    setUiScale(
      Math.min(window.innerWidth / 1000, window.innerHeight / 1200, 1)
    );
  };
  useEffect(() => {
    window.addEventListener("resize", updateUiScale);
    updateUiScale();
  }, []);

  return (
    <Wrapper>
      <Canvas ref={setCanvas}>
        <Shoe
          rotation={[0, 0, 0]}
          position={[0, 0, 0]}
          configuration={configuration}
        />
      </Canvas>
      <ConnectionCode code={sessionId} visible={!isLoaded} />
      <OverlayHeader $scale={uiScale} href={location.href}>
        Configurator
        <br />
        Concierge
        <ThreekitLogoWrapper
          style={{ transform: "scale(2)", transformOrigin: "top left" }}
        >
          <ThreekitInline />
        </ThreekitLogoWrapper>
        <SubHeader $visible={!isLoaded}>
          Create a one-of-a-kind sneaker with the power of Threekit AI and your
          own imagination.
          <br />
          Dream it, we'll build it.
        </SubHeader>
      </OverlayHeader>
      {isLoaded && (
        <ChatViewer
          initialMessages={[
            {
              type: "response",
              text: defaultMessage,
              configuration: {},
            },
          ]}
        ></ChatViewer>
      )}
    </Wrapper>
  );
}

async function crop(
  srcCanvas: HTMLCanvasElement,
  croppingCanvas: HTMLCanvasElement
) {
  await new Promise((r) => setTimeout(r, 1000)); // ensure configuration is rendered
  const ctx = croppingCanvas.getContext("2d")!;
  ctx.clearRect(0, 0, croppingCanvas.width, croppingCanvas.height);
  const srcHeight = srcCanvas.height;
  const srcWidth = Math.round(
    srcCanvas.height * (croppingCanvas.width / croppingCanvas.height)
  );
  ctx.drawImage(
    srcCanvas,
    (srcCanvas.width - srcWidth) / 2,
    0,
    srcWidth,
    srcHeight,
    0,
    0,
    croppingCanvas.width,
    croppingCanvas.height
  );
  const blob = await new Promise<Blob>((r: any) =>
    srcCanvas.toBlob(r, "image/jpeg", 0.9)
  );
  const file = new File([blob], "Threekit.png", { type: "image/png" });
  const formData = new FormData();
  formData.append("file", file);
  const {
    files: [{ hash: fileHash }],
  } = await (
    await fetch(
      `https://preview.threekit.com/api/files?bearer_token=${PUBLIC_TOKEN}&orgId=f20a5d56-ce82-4b88-9b71-f92b4b9616e6`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${PUBLIC_TOKEN}`,
        },
      }
    )
  ).json();
  return `https://preview.threekit.com/api/files/hash/${fileHash}`;
}
