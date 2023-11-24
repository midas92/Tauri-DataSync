"use client";

import { SessionProvider } from "next-auth/react";

const Provider = ({ children }:any) => {
  return <SessionProvider refetchWhenOffline={false} refetchInterval={30*60}>{children}</SessionProvider>;
};

export default Provider;
