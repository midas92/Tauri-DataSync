"use client";
import { invoke } from "@tauri-apps/api";
import React, { useCallback, useEffect, useState, useContext } from "react";
import Datatable from "@/components/datatable";
import { Pagination } from "@mui/material";
import { SyncContext } from "../layout";

export default function Home() {
  const { refreshLog } = useContext(SyncContext);
  const [data, setData] = useState<any>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totallog, setTotallog] = useState(0);

  const getlogs = useCallback(async () => {
    const logs = await invoke("get_log_pagination", {
      currentPage: currentPage,
    });
    const total: number = await invoke("get_count_log");
    setData(logs);
    setTotallog(Math.ceil(total / 5));
  }, [currentPage]);
  useEffect(() => {
    getlogs();
  }, [getlogs, refreshLog]);

  return (
    <div className="flex-grow bg-white p-4 h-[80vh] rounded-tl-xl text-black">
      {/* Content for the second div */}
      <div className="flex-grow bg-white p-6">
        <h1 className="text-4xl font-bold">Logs</h1>
        <div className="border-b-2 mt-4 mb-6"></div>
        <div className="flex flex-col">
          <Datatable datas={data} currentPage={currentPage} />
          <div className="my-3 mr-0 inline float-right">
            <Pagination
              count={totallog}
              color="primary"
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              style={{ float: "inline-end" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
