import { styled } from "styled-components";

export const ChatResponseDiv = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 60px;
  right: 60px;
  width: 40%;

  pointer-events: all;
  color: black;
  text-decoration: none;

  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 4px;

  padding: 15px;

  p {
    font-weight: normal;
    font-size: 20px;
    width: 100%;
    color: black;
    margin: 0;
  }

  transition: all 0.3s;

  opacity: ${(props) => (props.$visible ? "100%" : "0%")};
`;
