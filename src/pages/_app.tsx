import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "~/styles/quill.snow.css"
import NavBar from "./components/navBar";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from "next-themes";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={false} attribute="class">
          <NavBar/>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen = {false}/>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
