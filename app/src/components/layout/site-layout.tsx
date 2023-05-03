import React from "react";
import Nav from "./Nav";

interface LayoutProps {
  hasHeader: boolean;
  children: React.ReactNode;
}

const SiteLayout = ({ hasHeader = true, children }: LayoutProps) => (
  <>
    {hasHeader && <Nav />}

    <div>{children}</div>
  </>
);

export default SiteLayout;
