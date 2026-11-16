import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from './routing/routeTree.js';
import store from "./store/store.js";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient, store },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "449756177051-85p704evoj3er462f5vo5mnudvvpc9sv.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </Provider>
);
