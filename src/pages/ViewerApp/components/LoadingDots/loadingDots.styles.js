import styled, { keyframes } from "styled-components";

const SIZE = "5px";
const COLOR = "#aaa";

const flashing = keyframes`
    0% {
    background-color: ${COLOR};
    }
    50%, 100% {
    background-color: rgba(152, 128, 255, 0.2);
    }
`;

export const Dots = styled.div`
  position: relative;
  width: ${(props) => props.size || SIZE};
  height: ${(props) => props.size || SIZE};
  border-radius: 50%;
  background-color: ${(props) => props.color || COLOR};
  color: ${(props) => props.color || COLOR};
  animation: ${flashing} 1s infinite linear alternate;
  animation-delay: 0.5s;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: calc(-1 * 1.5 * ${(props) => props.size || SIZE});
    width: ${(props) => props.size || SIZE};
    height: ${(props) => props.size || SIZE};
    border-radius: 50%;
    background-color: ${(props) => props.color || COLOR};
    color: ${(props) => props.color || COLOR};
    animation: ${flashing} 1s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: calc(1.5 * ${(props) => props.size || SIZE});
    width: ${(props) => props.size || SIZE};
    height: ${(props) => props.size || SIZE};
    border-radius: 50%;
    background-color: ${(props) => props.color || COLOR};
    color: ${(props) => props.color || COLOR};
    animation: ${flashing} 1s infinite alternate;
    animation-delay: 1s;
  }
`;
