import React from "react";
import styled from "styled-components";

const Path = styled.path`
  stroke: #333;
  stroke-width: 2;
`;

export const Menu = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M2 4H18M2 10H18M2 16H18" />
    </svg>
  );
};

export default Menu;
