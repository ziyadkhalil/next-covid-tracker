import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "../index.css";
import { ReactElement, ReactNode, useState } from "react";
import { NextPage } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { setApiToken } from "../api";
import { ThemeProvider, ThemeToggle } from "../components/theme-toggle";
import Head from "next/head";

type NextPageWithLayout = NextPage<{}> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{}> & {
  Component: NextPageWithLayout;
};

if (typeof window !== "undefined") {
  const linkToken = new URLSearchParams(window.location.hash.substring(1)).get(
    "access_token"
  );

  if (linkToken) {
    localStorage.setItem("token", linkToken);
  }
}

const token = typeof window !== "undefined" && localStorage.getItem("token");
if (token) setApiToken(token);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => {
    return new QueryClient();
  });
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <div className="min-h-screen flex flex-col">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        {page}
      </div>
    ));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
      <Head>
        <title> Covid Next</title>
      </Head>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
