"use client";
import {invoke} from "@tauri-apps/api/tauri";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard () {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    const handleKeyDown = (event : KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  }, []);
  return <div></div>;
};
