import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { styled } from "styled-components";
import { Close, ThreekitInline } from "../../../../icons";
import { PUBLIC_TOKEN } from "../../../../constants";

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
`;

const Modal = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  background-color: white;
  overflow: hidden;
  transition: all 0s !important;
  padding: 24px;
  padding-top: 16px;
`;

const createQRCode = async (
  configuration: any,
  configurationPrompt: string
) => {
  console.log("creating QR code for", configuration, configurationPrompt);
  const { shortId } = await (
    await fetch(
      `https://preview.threekit.com/api/configurations?bearer_token=${PUBLIC_TOKEN}`,
      {
        method: "POST",
        body: JSON.stringify({
          productVersion: "v1",
          variant: {
            ...configuration,
            prompt: configurationPrompt,
          },
          productId: "86b76058-07ff-462d-b58a-63661ea8c357",
          orgId: "f20a5d56-ce82-4b88-9b71-f92b4b9616e6",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).json();

  const url = `${location.origin}/shared?id=${shortId}`;
  console.log("displaying QR code for url: ", url);
  const canvas = await QRCode.toCanvas(url, { margin: 0 });
  return canvas;
};

const StartOverButton = styled.button`
  color: black;
  background-color: #ffba9b;
  border: 1px solid #f98d70;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 16px;
  width: 100%;
  height: 32px;
  float: right;
`;

const CanvasWrapper = styled.div`
  width: 100%;
  height: auto;
  margin: 0;
  margin-top: 4px;
  border-radius: 4px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const ShareButtonStyled = styled.button`
  color: black;
  background-color: #ffba9b;
  border: 1px solid #f98d70;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 8px;
  width: 73px;
  height: 32px;
  float: right;

  &:disabled {
    background-color: #e6efef;
    border: 0;
    color: #aaa;
  }
`;

export const ShareButton = (props: {
  configuration: any;
  configurationPrompt: string;
  snapshotUrl: string;
  handleStartOver: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ShareButtonStyled
        onClick={() => setOpen(true)}
        disabled={!props.configurationPrompt}
      >
        Share
      </ShareButtonStyled>
      {<ShareModal {...props} open={open} setOpen={setOpen} />}
    </>
  );
};

const ShareModal = ({
  configuration,
  configurationPrompt,
  snapshotUrl,
  open,
  setOpen,
  handleStartOver,
}: {
  configuration: any;
  configurationPrompt: string;
  snapshotUrl: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleStartOver: () => void;
}) => {
  if (!open) return null;

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    (async () => {
      const canvas = await createQRCode(
        {
          ...configuration,
          snapshotUrl,
        },
        configurationPrompt
      );
      setCanvas(canvas);
    })();
  }, [configuration, configurationPrompt]);

  if (!canvas) return null; // loading

  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.margin = "0";
  canvas.style.animation = "fade-in 0s ease 0s forwards"; // there's probably a cleaner way of overriding this animation?

  return (
    <Overlay>
      <Modal>
        <ThreekitInline style={{ height: "30px" }} />
        <Close
          style={{
            float: "right",
            width: "30px",
            height: "30px",
            zIndex: "100000",
          }}
          onClick={() => setOpen(false)}
        />
        <CanvasWrapper
          ref={(ref: HTMLDivElement) => {
            if (!ref) return;
            for (const child of ref.children) child.remove();
            ref.appendChild(canvas);
          }}
        />
        <StartOverButton
          onClick={() => {
            handleStartOver();
            setOpen(false);
          }}
        >
          Start Over
        </StartOverButton>
      </Modal>
    </Overlay>
  );
};
