import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import { ChakraProvider } from "@chakra-ui/react";
import SiteLayout from "~/components/layout/site-layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <SiteLayout hasHeader={Component?.defaultProps?.hasHeader as boolean}>
          <Component {...pageProps} />
        </SiteLayout>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
