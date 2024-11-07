import { ErrorBoundary, Provider } from "@rollbar/react"; // Provider imports 'rollbar'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ControllerApp } from "./pages/ControllerApp/index.js";
import ViewerApp from "./pages/ViewerApp/App.jsx";
import { rollbarConfigReact } from "./constants.js";
import StaticViewer from "./pages/ViewerApp/StaticViewer.js";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/controller" element={<ControllerApp />} />
        <Route path="/" element={<ViewerApp />} />
        <Route path="/shared" element={<StaticViewer />} />
      </Routes>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <StrictMode>
    <Provider config={rollbarConfigReact}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);
