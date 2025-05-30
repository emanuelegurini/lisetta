import { Suspense } from "react";
import Layout from "@/components/Layout";
import { Components } from "@/routes/routes";

export const LazyComponent = (props) => {
  const { componentName } =
    props;

  const Component = Components[componentName];

  return (
    <>
      <Suspense
        fallback={
          <div style={{ height: "100vh" }}>
            <h1>Loading..</h1>
          </div>
        }
      >
          <Layout>
            <Component {...props} />
          </Layout>
      </Suspense>
    </>
  );
};