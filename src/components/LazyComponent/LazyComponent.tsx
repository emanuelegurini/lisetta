import { Suspense } from "react";
import Layout from "@/components/Layout";
import { Components } from "@/pages/routes";

const LazyComponent = (props) => {
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

export default LazyComponent