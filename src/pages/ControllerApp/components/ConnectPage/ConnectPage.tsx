import { styled } from "styled-components";
import { LooseContentWrapper } from "../../controllerApp.styles";
import { useRef, useState } from "react";

const TextBox = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border-radius: 10px;
  border: 1px solid #666;

  &::placeholder {
    color: rgba(0, 0, 0, 0.35);
    font-size: 16px;
  }
`;

const ConnectButton = styled.button`
  color: black;
  background-color: #ffba9b;
  border: 1px solid #666;
  padding: 8px 24px 8px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  margin-top: 16px;
  width: 113px;
  height: 48px;
`;

const ErrorMsg = styled.div`
  height: 24px;
  margin: 0;
  margin-top: -5px;
  margin-bottom: -19px;
  color: #d88f74;
  font-weight: bold;
`;

export const ConnectPage = ({
  onConnect,
  error,
}: {
  onConnect: (code: string) => void;
  error?: string;
}) => {
  const textRef = useRef<HTMLInputElement>(null);

  return (
    <LooseContentWrapper>
      <h2>Connection Code</h2>
      <TextBox type="text" placeholder="Enter Connection Code" ref={textRef} />
      <ErrorMsg>{error || ""}</ErrorMsg>
      <ConnectButton onClick={() => onConnect(textRef.current?.value!)}>
        Connect
      </ConnectButton>
    </LooseContentWrapper>
  );
};
