import { styled } from "styled-components";
import { LooseContentWrapper } from "../../controllerApp.styles";
import { useEffect, useState } from "react";
import { SmartConcierge } from "./SmartConcierge";
import { VerticalGrowLayout } from "../VerticalGrowLayout";
import { socket } from "../../../../socket";
import { ShareButton } from "./shareButton";

const Wrapper = styled.div``;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  margin-bottom: 12px;
`;

const Button = styled.button`
  flex: 1;
  max-width: 100%;
  margin: 5px;
  height: 48px;
  border-radius: 4px;
  border: 1px solid #666;
  font-size: 14px;
  font-weight: bold;
  background-color: #e6eeee;
`;

// Wraps chat AND direct configurator
const CompleteConfigurator = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  width: 100%;
  margin: 0;
  padding: 0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid black;
  height: 100%;
`;

const Tab = styled.button`
  border: none;
  background-color: transparent;
  line-height: 100%;
  margin-top: 16px;
  font-size: 16px;
  white-space: nowrap;
`;

const Tabs = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  background-color: white;
  height: 48px;
`;

export const ControllerPage = ({ sessionId }: { sessionId: string }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const [lastConfigAndPrompt, setLastConfigAndPrompt] = useState<{
    configuration: any;
    configurationPrompt: "";
  }>({ configuration: {}, configurationPrompt: "" });
  const [lastSnapshot, setLastSnapshot] = useState<string>("");

  useEffect(() => {
    socket.on("setConfiguration", (msg) => {
      setLastConfigAndPrompt({
        configuration: msg.configuration,
        configurationPrompt: msg.configurationPrompt,
      });
    });
    socket.on("snapshot", (msg) => {
      setLastSnapshot(msg.url);
    });
  }, []);

  const tabs = [
    {
      name: "Smart Concierge",
      width: "140px",
      el: <SmartConcierge sessionId={sessionId} />,
    },
    {
      name: "Config Form",
      width: "108px",
      el: <div style={{ height: "100%" }}>TODO: Implement configurator</div>,
    },
  ];

  const handleStartOver = () => {
    socket.emit("resetSession", { sessionId });
  };

  return (
    <>
      <VerticalGrowLayout
        header={
          <div>
            <LooseContentWrapper>
              <ButtonRow>
                <Button onClick={handleStartOver}>Start Over</Button>
                <Button>Disconnect</Button>
              </ButtonRow>
            </LooseContentWrapper>
          </div>
        }
        body={
          <CompleteConfigurator>
            <VerticalGrowLayout
              header={
                <Tabs>
                  {tabs.map((tab, i) => {
                    return (
                      <Tab
                        style={
                          i === activeTab
                            ? {
                                fontWeight: "bold",
                                textDecoration: "underline",
                                width: tab.width,
                                fontSize: "15.5px", // account for bold making the text larger
                              }
                            : {
                                width: tab.width,
                              }
                        }
                        onClick={() => setActiveTab(i)}
                      >
                        {tab.name}
                      </Tab>
                    );
                  })}
                  <ShareButton
                    {...lastConfigAndPrompt}
                    snapshotUrl={lastSnapshot}
                    handleStartOver={handleStartOver}
                  />
                </Tabs>
              }
              body={tabs.map((tab) => {
                const active = activeTab === tabs.indexOf(tab);
                return (
                  <div
                    style={{
                      visibility: active ? "visible" : "hidden",
                      width: "100%",
                      overflow: "hidden",
                      height: active ? "100%" : "0",
                    }}
                  >
                    {tab.el}
                  </div>
                );
              })}
            />
          </CompleteConfigurator>
        }
      />
    </>
  );
};
