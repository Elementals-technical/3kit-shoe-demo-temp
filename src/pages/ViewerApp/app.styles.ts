import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  font-family: "Inter", sans-serif;
  background: #d0d0d0;
`;

export const ThreekitLogoWrapper = styled.a`
  position: absolute;
  top: 230px;
  left: 14px;
  font-size: 13px;

  pointer-events: all;
  color: black;
  text-decoration: none;
`;

export const OverlayHeader = styled.a<{ $scale?: number; href?: string }>`
  position: fixed;
  top: 40px;
  left: 40px;
  font-size: 100px;
  margin: 0;
  color: #044849;
  font-weight: bold;

  pointer-events: ${(props) => (props.href ? "all" : "none")};
  text-decoration: none;
  line-height: 1;

  transform-origin: top left;
  transform: scale(${(props) => props.$scale || 1});
`;

export const SubHeader = styled.p<{ $visible: boolean }>`
  position: absolute;
  top: 300px;
  left: 14px;
  margin: 0;
  width: 650px;

  pointer-events: none;
  text-decoration: none;

  color: black;
  font-size: 25px;
  font-weight: normal;
  line-height: 1.2;
  opacity: ${(props) => (props.$visible ? "100%" : "0%")};
`;

export const ShareToLinkedInWrapper = styled.a<{ $scale?: number }>`
  position: absolute;
  bottom: 50px;
  left: 50px;
  width: 200px;
  height: auto;
  &:link,
  :visited,
  :hover,
  :active {
    text-decoration: none;
  }
  span {
    color: white;
    text-shadow: 0px 0px 5px black;
    font-weight: bold;
    font-size: 200%;
    overflow: visible;
    white-space: nowrap;
  }
  transform-origin: bottom left;
  transform: scale(${(props) => props.$scale || 1});
`;
