export const SERVER_URL =
  // @ts-ignore
  import.meta.env.VITE_SERVER_URL ?? "https://marketing-demo.3kit.com/";

export const PUBLIC_TOKEN =
  // @ts-ignore
  import.meta.env.VITE_PUBLIC_TOKEN ?? "a7a07ea4-1614-4355-a681-b50d1e654081";

export const rollbarConfigReact = {
  accessToken: "0607b566ff504c2e85799a7eab17263a",
  environment: "production", // this may be wrong.
};

export const OPEN_CLOSE_ATTRIBUTE = "Model Presentation";
export const ROTATION_ATTRIBUTE = "Rotate Model";
