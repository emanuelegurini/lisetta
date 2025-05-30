import type { ReactNode } from "react";
import Header from "../Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
      <div className="m-auto w-full max-w-[1200px] flex-1 p-8">
        <Header/>
          {children}
      </div>
  ) 
};

export default Layout;
