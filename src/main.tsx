import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PostHogProvider } from "posthog-js/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
};
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
  ],
  {
    basename: "/components-radar",
  }
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={options}
    >
      <RouterProvider router={router} />
    </PostHogProvider>
  </StrictMode>
);
