import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import ErrorBoundary from "./Components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ErrorBoundary>
  </StrictMode>
);
