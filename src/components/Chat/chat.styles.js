import styled from "styled-components";
import { theme } from "../../pages/ViewerApp/constants";

const COLORS = {
  sent: "#28826b",
  response: "white",
};

const AVATAR_SIZE = "0px";
const CONFIGURATION_BTN_SIZE = "32px";
const MESSAGE_WIDTH = "300px";

export const Wrapper = styled.div`
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  transition: all 0.3s;
  transition: visibility 0s;
`;

export const Content = styled.div`
  padding: 14px 0;
  height: 100%;
  max-height: 100%;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  margin-top: 8px;
`;

export const Line = styled.hr`
  width: 84px;
  height: 1px;
  outline: none;
  border: none;
  background: #3e597344;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const ChatArea = styled.div`
  margin-bottom: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  mask-image: linear-gradient(to top, black 92%, transparent 100%);
  height: 100%;
  max-height: 100%;

  & > div:nth-child(0) {
    padding-bottom: 12px;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
`;

export const WidgetButton = styled.button`
  position: absolute;
  height: 36px;
  width: 36px;
  border-radius: 15px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`;

export const AvatarWrapper = styled.div`
  height: ${AVATAR_SIZE};
  width: ${AVATAR_SIZE};
  border-radius: 50%;
  background: ${theme.green};
`;

export const Message = styled.div`
  height: max-content;
  padding: 12px;
  padding-top: 14px;
  padding-bottom: 14px;
  max-width: ${MESSAGE_WIDTH};
  font-size: 15px;
  overflow-wrap: break-word;

  border-radius: 8px;
  margin: 12px;
`;

export const MessageWrapper = styled.div`
  display: grid;
  grid-gap: 6px;
`;
export const SentMessageWrapper = styled(MessageWrapper)`
  grid-template-columns: auto max-content ${AVATAR_SIZE};
`;
export const ResponseMessageWrapper = styled(MessageWrapper)`
  grid-template-columns: max-content ${CONFIGURATION_BTN_SIZE};
`;

export const SentMessageText = styled(Message)`
  border-top-right-radius: 0px;
  background: ${COLORS.sent};
  color: white;
  border: 1px solid #185243;
`;

export const ResponseMessageText = styled(Message)`
  border-top-left-radius: 0px;
  background: ${COLORS.response};
  width: 290px;
  border: 1px solid #28826b;
`;

export const ConfigurationButton = styled.button`
  height: ${CONFIGURATION_BTN_SIZE};
  width: ${CONFIGURATION_BTN_SIZE};
  border-radius: 50%;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  background: ${theme.mint}aa;

  &:hover {
    box-shadow: 1px 1.5px 1px #11111133;
    background: ${theme.mint}ff;
  }
`;

export const NewMesageArea = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: 6px;
  padding: 0 12px;
`;

export const MessageArea = styled.textarea`
  resize: none;
  height: 40px;
  outline: none;
  padding: 12px;
  /* font-size: 16px; */
  border-radius: 12px;
  max-height: 330px;
  border: 1px solid #bfbfbf;

  transition: all 0.1s;
  transition: visibility 0s;

  &::-webkit-scrollbar {
    width: 0px;
  }

  overflow-wrap: break-word;
`;

export const SubmitButton = styled.button`
  height: 42px;
  width: 42px;
  border-radius: 50%;
  background: ${theme.darkGreen}bb;
  color: white;
  cursor: pointer;
  outline: none;
  border: none;

  &:hover {
    box-shadow: 2px 2px 3px #11111133;
    background: ${theme.darkGreen}ff;
  }
`;

export const Username = styled.h2`
  color: inherit;
  font-size: 18px;
`;
