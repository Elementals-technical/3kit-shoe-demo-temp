import { useEffect, useRef, useState } from "react";
import {
  ChatArea,
  Content,
  ResponseMessageText,
  ResponseMessageWrapper,
  SentMessageText,
  SentMessageWrapper,
  Username,
} from "../../../../components/Chat/chat.styles";
import { VerticalGrowLayout } from "../../../ControllerApp/components/VerticalGrowLayout";
import LoadingDots from "../LoadingDots";
import { ChatResponseDiv } from "./chatviewer.styles";
import { styled } from "styled-components";
import { socket } from "../../../../socket";

const SentMessage = (props: { text: string }) => {
  const { text } = props;
  return (
    <SentMessageWrapper>
      <div />
      <SentMessageText>{text}</SentMessageText>
    </SentMessageWrapper>
  );
};
const ResponseMessage = (props: {
  isMessageChain: boolean;
  message: { text: string };
}) => {
  const { isMessageChain, message } = props;

  // const handleClickApplyMessage = () => applyMessage(message);

  return (
    <ResponseMessageWrapper>
      <ResponseMessageText>
        <Username>Smart Concierge</Username>
        {message.text}
      </ResponseMessageText>
      {/* <ApplyMessage
        configuration={message.configuration}
        onClick={handleClickApplyMessage}
      /> */}
    </ResponseMessageWrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  right: 10px;
  bottom: 50px;
  width: 400px;
  height: 500px;
  overflow: hidden;
  & * {
    overflow: hidden;
  }
  opacity: 70%;
  pointer-events: none;
`;

export const ChatViewer = (props: {
  initialMessages: {
    type: string;
    text: string;
    configuration: any;
  }[];
}) => {
  const { initialMessages } = props;

  const chatAreaRef = useRef<any>();
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    socket.on("postSendMessage", ({ message }) => {
      console.log("on post send message");
      setMessages((prevMessages) => {
        if (!(prevMessages[prevMessages.length - 1].text === message)) {
          return [
            ...prevMessages,
            {
              type: "sent",
              text: message,
              configuration: {},
            },
          ];
        } else return prevMessages;
      });
    });
    socket.on("responseInProgress", () => {
      setAwaitingResponse(true);
    });
    socket.on("messageComplete", (newChat) => {
      console.log("Response complete.");
      setMessages((prevMessages) => {
        // The server socket message emits only once, but this event is firing multiple times,
        // leading to duplicate message posts in chat without this if statement.
        if (newChat.text === "reset") return initialMessages;
        if (!(prevMessages[prevMessages.length - 1].text === newChat.text)) {
          return [
            ...prevMessages,
            {
              type: "response",
              text: newChat.text,
              configuration: {},
            },
          ];
        } else return prevMessages;
      });
      setAwaitingResponse(false);
    });
  }, []);

  return (
    <Wrapper>
      <Content>
        <VerticalGrowLayout
          body={
            <ChatArea ref={chatAreaRef}>
              <div
                style={{
                  bottom: "20px",
                  right: "0",
                  position: "absolute",
                  paddingBottom: "5px",
                  width: "100%",
                }}
              >
                {messages.map((message, i) => {
                  const isMessageChain =
                    i > 0 && messages[i - 1].type === message.type;
                  if (message.type === "sent")
                    return <SentMessage {...message} />;
                  return (
                    <ResponseMessage
                      message={message}
                      isMessageChain={isMessageChain}
                    />
                  );
                })}
              </div>
            </ChatArea>
          }
        />
      </Content>
    </Wrapper>
  );
};
