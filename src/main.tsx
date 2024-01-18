import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import SafeProvider from "@safe-global/safe-apps-react-sdk";

import App from "./App.tsx";

import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SafeProvider>
        <App />
      </SafeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
