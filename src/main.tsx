/**
 * External dependencies.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/**
 * Internal dependencies.
 */
import "@/styles/global.css";
import { App } from "@/app.tsx";
import { AppProvider } from "@/store/providers/AppProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
