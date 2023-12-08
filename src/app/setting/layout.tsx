"use client";
import Provider from "@/components/auth/Provider";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { SyncContextType } from "@/types/sync";
import { createContext, useState } from "react";

export const SyncContext = createContext<SyncContextType>({
  intervalID: 0,
  setIntervalID:(e)=>{},
  sync: false,
  setSync: (e) => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sync, setSync] = useState(false);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout>(
    setTimeout(() => {}, 1)
  );
  return (
    <div className="flex">
      <Navbar />
      <Provider>
        <SyncContext.Provider value={{ sync, setSync, intervalID, setIntervalID }}>
          <div className="w-4/5 bg-gray-100 h-screen">
            <Header />
            {children}
          </div>
        </SyncContext.Provider>
      </Provider>
    </div>
  );
}
