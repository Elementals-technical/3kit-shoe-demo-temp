import { styled } from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  width: 100%;

  background: linear-gradient(#044748, #096768);
`;

// For the header and stuff, things that aren't wrapped in a clearly visible div/panel
export const LooseContentWrapper = styled.div`
  padding: 16px;
  margin: 0;
  padding-top: 20px;
  padding-bottom: 0;
`;
