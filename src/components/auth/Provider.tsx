"use client";

import { SessionProvider } from "next-auth/react";

const Provider = ({ children }:any) => {
  return <SessionProvider refetchWhenOffline={false} refetchInterval={60*30}>{children}</SessionProvider>;
};

export default Provider;
