import React from "react";
import Nav from "./Nav";
import Head from "next/head";

interface LayoutProps {
  hasHeader: boolean;
  children: React.ReactNode;
}

const SiteLayout = ({ hasHeader = true, children }: LayoutProps) => (
  <>
    {hasHeader && <Nav />}
    <Head>
      <title>House Price Tracker</title>
    </Head>
    <div>{children}</div>
  </>
);

export default SiteLayout;
