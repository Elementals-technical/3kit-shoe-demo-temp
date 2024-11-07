import type React from "react";
import { styled } from "styled-components";

/**
 * Hacky layout helper. Typically, you have a header with a fixed height, and
 * you want the body to grow to fill the remaining space.
 * You can also use a footer as well, only the body will grow to occupy the
 * remaining space.
 */

const Table = styled.table`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  vertical-align: top;
  border: 0;
  box-sizing: border-box;

  tr {
    width: 100%;
    margin: 0;
    padding: 0;
    vertical-align: top;
    border: 0;
    box-sizing: border-box;

    td {
      width: 100%;
      margin: 0;
      padding: 0;
      vertical-align: top;
      border: 0;
      box-sizing: border-box;
    }
  }
`;

export const VerticalGrowLayout = ({
  header,
  body,
  footer,
}: {
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <Table>
      {header && (
        <tr>
          <td>{header}</td>
        </tr>
      )}
      <tr style={{ height: "100%" }}>
        <td>{body}</td>
      </tr>
      {footer && (
        <tr>
          <td>{footer}</td>
        </tr>
      )}
    </Table>
  );
};
