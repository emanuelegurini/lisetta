import { lazy } from "react";
import LazyComponent from "@/components/LazyComponent";

const Homepage = lazy(() => import("./Homepage"));

export const Components = {
  Homepage,
};

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  children?: RouteConfig[];
}

export const authRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <LazyComponent componentName="Homepage" />
  }
]

export const publicRoutes: RouteConfig[] = [];