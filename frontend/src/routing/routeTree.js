import { createRootRouteWithContext } from "@tanstack/react-router";
import { authRoute } from "./auth";
import RootLayout from "../RootLayout";
import { dashboardRoute } from "./dashboard";
import { homepageRoute } from "./homepage";

export const rootRoute = createRootRouteWithContext()({
  component: RootLayout,
});

export const routeTree = rootRoute.addChildren([
  authRoute,
  dashboardRoute,
  homepageRoute,
]);
