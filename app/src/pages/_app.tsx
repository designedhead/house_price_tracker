import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { api } from "~/utils/api";

import { ChakraProvider } from "@chakra-ui/react";
import SiteLayout from "~/components/layout/site-layout";

import "../styles/slidesStyles.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <SessionProvider session={session}>
        <SiteLayout hasHeader={Component?.defaultProps?.hasHeader as boolean}>
          <Component {...pageProps} />
        </SiteLayout>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
