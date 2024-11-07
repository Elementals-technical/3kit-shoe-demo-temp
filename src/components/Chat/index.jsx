import { useState, useRef, useEffect } from "react";
import {
  Wrapper,
  Content,
  ChatArea,
  SentMessageText,
  ResponseMessageText,
  MessageArea,
  NewMesageArea,
  SubmitButton,
  SentMessageWrapper,
  ResponseMessageWrapper,
  ConfigurationButton,
  Username,
} from "./chat.styles";
import { Open, Send } from "../../icons";
import LoadingDots from "../LoadingDots";
import { VerticalGrowLayout } from "../../pages/ControllerApp/components/VerticalGrowLayout";
import { socket } from "../../socket";

const SentMessage = (props) => {
  const { isMessageChain, text } = props;
  return (
    <SentMessageWrapper isMessageChain={isMessageChain}>
      <div />
      <SentMessageText>{text}</SentMessageText>
    </SentMessageWrapper>
  );
};
const ResponseMessage = (props) => {
  const { isMessageChain, message, applyMessage, loading } = props;

  return (
    <ResponseMessageWrapper isMessageChain={isMessageChain}>
      <ResponseMessageText>
        <Username>Smart Concierge</Username>
        {loading ? <LoadingDots /> : message.text}
      </ResponseMessageText>
    </ResponseMessageWrapper>
  );
};

const Chat = (props) => {
  const [messages, setMessages] = useState(props.initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const textareaRef = useRef();
  const chatAreaRef = useRef();

  useEffect(() => {
    chatAreaRef.current.scrollTo(0, chatAreaRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    socket.on("responseInProgress", () => {
      setAwaitingResponse(true);
    });

    socket.on("messageComplete", (newChat) => {
      console.log("Response complete.");
      setMessages((prevMessages) => {
        // The server socket message emits only once, but this event is firing multiple times,
        // leading to duplicate message posts in chat without this if statement.
        if (newChat.text === "reset") return props.initialMessages;
        if (!(prevMessages[prevMessages.length - 1].text === newChat.text)) {
          return [
            ...prevMessages,
            {
              type: "response",
              text: newChat.text,
            },
          ];
        } else return prevMessages;
      });
      setAwaitingResponse(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (!newMessage.trim().length) return;
    if (awaitingResponse) return;
    props.onMessage(newMessage);
    setMessages((prevMessages) => {
      return [
        ...prevMessages,
        {
          type: "sent",
          text: newMessage,
          configuration: null,
        },
      ];
    });
    setNewMessage("");
  };

  const handleKeyUp = (e) => {
    textareaRef.current.style.height = `${e.target.scrollHeight}px`;
  };

  const handleChange = (e) => {
    if (awaitingResponse) return;
    if (e.keyCode === 13) return;
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    handleSubmit();
    e.stopPropagation();
  };

  return (
    <Wrapper>
      <Content>
        <VerticalGrowLayout
          body={
            <ChatArea ref={chatAreaRef}>
              <div>
                {messages.map((message, i) => {
                  const isMessageChain =
                    i > 0 && messages[i - 1].type === message.type;
                  if (message.type === "sent")
                    return (
                      <SentMessage
                        {...message}
                        isMessageChain={isMessageChain}
                      />
                    );
                  return (
                    <ResponseMessage
                      message={message}
                      isMessageChain={isMessageChain}
                      onMessage={props.applyMessage}
                    />
                  );
                })}
              </div>
            </ChatArea>
          }
          footer={
            <NewMesageArea>
              <MessageArea
                ref={textareaRef}
                value={newMessage}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                placeholder="Type a message"
              />
              <SubmitButton disabled={awaitingResponse} onClick={handleSubmit}>
                <Send height="18px" />
              </SubmitButton>
            </NewMesageArea>
          }
        />
      </Content>
    </Wrapper>
  );
};

export default Chat;
