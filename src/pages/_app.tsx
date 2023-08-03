import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "~/styles/quill.snow.css"
import NavBar from "./components/navBar";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NavBar/>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen = {false}/>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
