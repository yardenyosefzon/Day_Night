import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "~/styles/quill.snow.css"
import NavBar from "./components/navBar";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Script src="/static/nagishLi/nagishli.js?v=2.3" defer></Script>
      <ThemeProvider enableSystem={false} attribute="class">
          <NavBar/>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen = {false}/>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
