import { LazyComponent } from "@/hoc/LazyComponent";
import { lazy } from "react";
import { Route } from "react-router";

const Homepage = lazy(
  () => import("./Homepage")
);

export const Components = {
  Homepage,
};

export const createRoutes = () => ({
  routes: [
    {
      key: "Home",
      component: (props) => (
        <Route
          path="/*"
          key="Homepage"
          element={
            <LazyComponent
              componentName="Homepage"
              {...props}
            />
          }
        />
      ),
    },
  ],
});
