"use client";
import Provider from "@/components/auth/Provider";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { createContext, useContext, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex">
        <Navbar />
        <Provider>
          <div className="w-4/5 bg-gray-100 h-screen">
            <Header />
            {children}
          </div>
        </Provider>
      </div>
  );
}
