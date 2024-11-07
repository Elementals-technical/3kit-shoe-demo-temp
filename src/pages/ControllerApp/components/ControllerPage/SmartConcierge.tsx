import Chat from "../../../../components/Chat";
import { socket } from "../../../../socket";

const postMessage = async (
  sessionId: string,
  messageType: string,
  message: any
) => {
  console.log("posting message to server", messageType, message);
  socket.emit(messageType, {
    sessionId,
    ...message,
  });
};

export const SmartConcierge = ({ sessionId }: { sessionId: string }) => {
  return (
    <Chat
      initialMessages={[
        {
          type: "response",
          text: "What kind of color scheme would you like to get started? If you're not sure, you can start by asking for a shoe in your favourite colors, or with the theme of your sports teams or even shoes to match your current fit.",
          configuration: null,
        },
      ]}
      onMessage={async (message: any) => {
        console.log("user sent a message:", message);
        postMessage(sessionId, "postSendMessage", { message });
        // await new Promise((r) => setTimeout(r, 1000)); // fake sleep
        // return {
        //   type: "response",
        //   text: "Hello Im a bot",
        //   configuration: {},
        // };
      }}
      applyMessage={(message: any) => {
        console.log("applying message", message);
      }}
    />
  );
};
