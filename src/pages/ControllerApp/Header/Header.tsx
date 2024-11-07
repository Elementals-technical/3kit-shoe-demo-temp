import { styled } from "styled-components";
import { ThreekitInline } from "../../../icons";
import { LooseContentWrapper } from "../controllerApp.styles";

const H1 = styled.h1`
  margin: 0;
  margin-top: 2px;
  margin-bottom: 2px;
`;

export const Header = () => {
  return (
    <LooseContentWrapper>
      <H1>Configurator Concierge</H1>
      <ThreekitInline />
    </LooseContentWrapper>
  );
};
