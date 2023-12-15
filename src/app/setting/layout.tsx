"use client";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { SyncContextType, TokenType } from "@/types/sync";
import { createContext, useEffect, useState } from "react";

export const SyncContext = createContext<SyncContextType>({
  intervalID: 0,
  setIntervalID: (e) => {},
  sync: false,
  setSync: (e) => {},
  token: {
    access_token: "",
    refresh_token: "",
    expiration: 0,
  },
  setToken: (e) => {},
  refreshLog: false,
  setRefreshLog: (e) => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sync, setSync] = useState(false);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout>(
    setTimeout(() => {}, 1)
  );
  const [token, setToken] = useState<TokenType>({
    access_token: "",
    refresh_token: "",
    expiration: 0,
  });

  const [refreshLog, setRefreshLog] = useState(false);

  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem("token") || "{}"));
  }, []);
  return (
    <div className="flex">
      <Navbar />
      <SyncContext.Provider
        value={{
          sync,
          setSync,
          intervalID,
          setIntervalID,
          token,
          setToken,
          refreshLog,
          setRefreshLog,
        }}
      >
        <div className="w-4/5 bg-gray-100 h-screen">
          <Header />
          {children}
        </div>
      </SyncContext.Provider>
    </div>
  );
}
