import { useEffect, useState } from "react";

import { SERVER_URL } from "../../constants.js";
import { Wrapper } from "./controllerApp.styles.js";
import { socket } from "../../socket.js";
import { Header } from "./Header/Header.js";
import { ConnectPage } from "./components/ConnectPage/ConnectPage.js";
import { ControllerPage } from "./components/ControllerPage/ControllerPage.js";
import { VerticalGrowLayout } from "./components/VerticalGrowLayout.js";

export const ControllerApp = () => {
  const [session, setSession] = useState<null | {
    sessionId: string;
  }>(null);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    socket.on("loadProduct", (session) => {
      setSession(session);
    });
    socket.on("connectionFailed", (session) => {
      setError(session.error || "An error occurred");
    });
  }, []);

  return (
    <Wrapper>
      <VerticalGrowLayout
        header={<Header />}
        body={
          session ? (
            <ControllerPage sessionId={session.sessionId} />
          ) : (
            <ConnectPage
              onConnect={(code) => {
                socket.emit("initProduct", { sessionId: code });
              }}
              error={error}
            />
          )
        }
      />
    </Wrapper>
  );
};
