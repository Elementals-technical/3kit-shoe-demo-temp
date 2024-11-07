import { ConnectionCodeDiv } from "./connectionCode.styles";

export const ConnectionCode = (props: { code: string; visible: boolean }) => {
  const { code } = props;
  return (
    <ConnectionCodeDiv $visible={props.visible}>
      <h1>Connection Code</h1>
      <p>{code}</p>
    </ConnectionCodeDiv>
  );
};
