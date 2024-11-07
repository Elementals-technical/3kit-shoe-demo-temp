import { useState, useEffect } from "react";
import Shoe from "./Fiber3D/Shoe";
import Canvas from "./Fiber3D/Canvas";
import { ThreekitInline } from "../../icons";
import {
  Wrapper,
  ThreekitLogoWrapper,
  OverlayHeader,
  ShareToLinkedInWrapper,
} from "./app.styles";

import { ChatViewer } from "./components/ChatViewer";
import { prepConfiguration } from "./utils";
import { PUBLIC_TOKEN } from "../../constants";

export default function StaticViewer() {
  const [configuration, setConfiguration] = useState<any>();
  const [prompt, setPrompt] = useState("");
  const [canvas, setCanvas] = useState<any>(null);

  const shortId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    (async () => {
      const result = await (
        await fetch(
          `https://preview.threekit.com/api/configurations/${shortId}?bearer_token=${PUBLIC_TOKEN}&orgId=f20a5d56-ce82-4b88-9b71-f92b4b9616e6`
        )
      ).json();
      const { prompt, ...configuration } = result.variant;
      setPrompt(prompt);
      setConfiguration(prepConfiguration(configuration));
    })();
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

  if (!prompt) return null;

  return (
    <Wrapper>
      <Canvas ref={setCanvas}>
        <Shoe configuration={configuration} />
      </Canvas>
      <OverlayHeader $scale={uiScale}>
        Configurator
        <br />
        Concierge
        <ThreekitLogoWrapper
          href="https://threekit.com/"
          style={{ transform: "scale(2)", transformOrigin: "top left" }}
        >
          <ThreekitInline />
        </ThreekitLogoWrapper>
      </OverlayHeader>
      <ShareToLinkedInWrapper
        $scale={uiScale}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          `${location.origin}/shared?id=${shortId}`
        )}`}
      >
        <img src="LinkedIn_Logo.svg" />
        <br />
        <span>Share To LinkedIn</span>
      </ShareToLinkedInWrapper>
      <ChatViewer
        initialMessages={[
          {
            type: "sent",
            text: prompt,
            configuration: {},
          },
        ]}
      ></ChatViewer>
    </Wrapper>
  );
}
