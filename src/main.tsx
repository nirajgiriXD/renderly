/**
 * External dependencies.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

/**
 * Internal dependencies.
 */
import "@/styles/global.css";
import { App } from "@/App";
import { APP_BASENAME } from "@/constants";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ConfigProvider, SettingsProvider, WorkspaceProvider } from "@/store";

/**
 * Pins the URL to the app's base path before the router mounts.
 *
 * This is a single-view app: everything that varies lives in the query string,
 * so any other pathname is stale — a bookmark from a build with a different
 * `base`, or a URL that already carries the prefix twice. Left alone, such a
 * path sticks, because the router preserves whatever it mounted on and writes
 * it back on the next search-param update.
 */
const normalisePath = () => {
  const base = import.meta.env.BASE_URL;
  if (window.location.pathname === base) return;

  window.history.replaceState(
    null,
    "",
    base + window.location.search + window.location.hash
  );
};

normalisePath();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Missing #root element.");
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary label="The app">
      <BrowserRouter basename={APP_BASENAME}>
        {/* Settings first: the config store reads the persistence preference. */}
        <SettingsProvider>
          <ConfigProvider>
            <WorkspaceProvider>
              <App />
            </WorkspaceProvider>
          </ConfigProvider>
        </SettingsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
