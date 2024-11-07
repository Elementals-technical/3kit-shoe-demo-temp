import { styled } from "styled-components";

export const ConnectionCodeDiv = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 40px;
  left: 40px;
  font-size: 13px;

  pointer-events: none;
  color: black;
  text-decoration: none;

  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 4px;

  transform: scale(2);
  transform-origin: bottom left;

  padding: 13px;
  padding-left: 20px;
  padding-right: 20px;

  h1,
  p {
    font-weight: normal;
    font-size: 14px;
    width: 100%;
    margin: 0;
    color: black;
  }
  p {
    margin-top: 10px;
    font-weight: bold;
  }

  transition: all 0.3s;

  opacity: ${(props) => (props.$visible ? "100%" : "0%")};
`;
