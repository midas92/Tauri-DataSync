"use client";
import { invoke } from "@tauri-apps/api";
import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import Datatable from "@/components/datatable";

export default function Home() {
  const [data, setData] = useState<any>();
  const getlogs = useCallback(async () => {
    console.log("lazy");
    const logs = await invoke("get_all_log");
    setData(logs);
    console.log("logssss", logs);
  }, []);
  useEffect(() => {
    getlogs();
  }, [getlogs]);

  return (
    <div className="flex-grow bg-white p-4 h-[80vh] rounded-tl-xl text-black">
      {/* Content for the second div */}
      <div className="flex-grow bg-white p-6">
        <h1 className="text-4xl font-bold">Logs</h1>
        <div className="border-b-2 mt-4 mb-6"></div>
        <div className="flex">
          <Datatable datas={data} />
        </div>
      </div>
    </div>
  );
}
