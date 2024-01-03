"use client";
import React, { useState, useEffect, useContext } from "react";
import Toggle from "@/components/toggle";
import SelectInput from "@/components/select";
import SelectDetail from "@/components/selectdetail";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { isEmpty, isNull, isUndefined } from "lodash";
import { syncTypes } from "@/constants/sync";
import { ModifiedTimeType, Sync, SyncDataType, TokenType } from "@/types/sync";
import { SyncContext } from "@/app/setting/layout";
import { refreshAccessToken } from "@/services/auth";

export const getLastModifiedDate = async (path: string) => {
  try {
    if (typeof window !== "undefined") {
      const res: ModifiedTimeType = await invoke("get_file_metainfo", {
        filePath: path,
      });
      return res.secs_since_epoch * 1000;
    }
  } catch (err) {
    console.error("Error getting file status:", err);
    return 0;
  }
};

export const getGoogleDriveFileInfo = async (
  fileId: string,
  token: TokenType
) => {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files/" + fileId,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token?.access_token,
          },
        }
      );
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`HTTP error: ${res.status}`);
      }
    }
  } catch (err) {
    console.error("Error getting file status:", err);
  }
};

export const msToTimeString = (ms: number) => {
  var date = new Date(ms);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  var hours = String(date.getHours()).padStart(2, "0");
  var minutes = String(date.getMinutes()).padStart(2, "0");
  var seconds = String(date.getSeconds()).padStart(2, "0");

  return (
    year + ":" + month + ":" + day + " " + hours + ":" + minutes + ":" + seconds
  );
};

export default function Home() {
  const { sync, setSync, intervalID, token, setToken } =
    useContext(SyncContext);
  const [synctype, setSynctype] = useState("d");
  const [detail, setDetail] = useState(0);
  const [syncstatus, setSyncstatus] = useState(false);

  const handleSyncType = (e: string) => {
    setSynctype(e);
    setDetail(0);
  };
  const [filePath, setfilePath] = useState("");
  const [fileId, setFileId] = useState("");

  const getfileid = async () => {
    try {
      if (isEmpty(fileId) && !isEmpty(token.refresh_token)) {
        console.log("first token", token);
        await refreshAccessToken(token, setToken);
        const res: any = await invoke("google_drive_search", {
          token: token?.access_token,
        });
        console.log("fild id res", res);
        if (res.files.length > 0) {
          localStorage.setItem("fileId", res?.files[0]?.id);
          setFileId(res?.files[0]?.id);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  useEffect(() => {
    setfilePath(localStorage.getItem("filePath") || "");
    setFileId(localStorage.getItem("fileId") || "");
    getData();
  }, []);

  const handleChange = async (e: any) => {
    try {
      e.preventDefault();
      const nowLocalTime = msToTimeString(new Date().getTime());
      if (isEmpty(filePath) && !isEmpty(fileId)) {
        // if we don't have file path
        const directory = await open({
          title: "Select Database folder",
          directory: true,
          multiple: false,
        });
        if (!isNull(directory)) {
          console.log("directory", directory);
          // download file on directory path
          await invoke("google_drive_download", {
            path: directory.toString(),
            token: token?.access_token,
            fileid: fileId,
            filepath: false,
          });
          const cloudFileInfo = await getGoogleDriveFileInfo(fileId, token);
          const filename = cloudFileInfo.name.split("--");
          setfilePath(directory + "\\" + filename[0]);
          localStorage.setItem("filePath", directory + "\\" + filename[0]);
          const cloudModified = msToTimeString(parseInt(filename[1]));
          await invoke("insert_log", {
            drive: "google",
            actionType: "manual",
            create: nowLocalTime,
            prev: cloudModified,
            upload: "download",
            path: directory + "\\" + filename[0],
          });
          console.log("create log to download");
        }
      } else {
        // if we have set file path.
        const file = await open({
          title: "Select Database file",
          directory: false,
          multiple: false,
          filters: [
            {
              name: "Sqlite",
              extensions: ["sqlite", "sqlite3", "db", "db3", "s3db", "sl3"],
            },
          ],
        });
        console.log("file", file);
        if (!isNull(file)) {
          setfilePath(file.toString());
          const fileMetadata = await getLastModifiedDate(file.toString());
          localStorage.setItem("filePath", file.toString());
          console.log(fileMetadata, "fimemetadata");
          if (isEmpty(fileId)) {
            console.log("upload");
            let res: any = await invoke("google_drive_upload", {
              path: file,
              token: token?.access_token,
            });
            console.log("res", res);
            localStorage.setItem("fileId", res?.id);
            setFileId(res?.id);
            let res1: any = await invoke("google_drive_update_metadata", {
              path: file.toString(),
              token: token?.access_token,
              fileId: res?.id,
              mtime: fileMetadata?.toString(),
            });
            console.log("res1", res1);
            setfilePath(file.toString());
            invoke("insert_log", {
              drive: "google",
              actionType: "manual",
              create: nowLocalTime,
              prev: msToTimeString(fileMetadata || 0),
              upload: "upload",
              path: file.toString(),
            });
            console.log("create log to upload");
          } else {
            console.log("jijijijijijijijijij");
            const fileMetadata = await getLastModifiedDate(filePath);
            console.log(fileMetadata, "filemetadata");
            const nowLocalTime = msToTimeString(new Date().getTime());
            const cloudFileInfo = await getGoogleDriveFileInfo(fileId, token);
            const filename = cloudFileInfo?.name.split("--");
            console.log("cloud", filename);
            const cloudModified = msToTimeString(parseInt(filename[1]));
            if ((fileMetadata || 0) >= filename[1]) {
              //upload
              console.log("upload update");
              console.log("cloudModified", cloudModified);
              let res: any = await invoke("google_drive_update_content", {
                path: filePath,
                token: token?.access_token,
                fileid: fileId,
              });
              console.log("update_content", res);

              let res1: any = await invoke("google_drive_update_metadata", {
                path: file.toString(),
                token: token?.access_token,
                fileid: fileId,
                mtime: fileMetadata?.toString(),
              });
              console.log("res1", res1);
              invoke("insert_log", {
                drive: "google",
                actionType: "manual",
                create: nowLocalTime,
                prev: cloudModified,
                upload: "upload",
                path: file.toString(),
              });
              console.log("create log to upload");
            } else {
              // download
              console.log("file download");
              await invoke("google_drive_download", {
                path: file.toString(),
                token: token?.access_token,
                fileid: fileId,
                filepath: true,
              });
              invoke("insert_log", {
                drive: "google",
                actionType: "manual",
                create: nowLocalTime,
                prev: cloudModified,
                upload: "download",
                path: file.toString(),
              });
              console.log("create log to download");
            }
          }
        }
      }
    } catch (e) {
      console.log("Error emitted :", e);
    }
  };

  const getData = async () => {
    const data: Array<Sync> = await invoke("get_sync");
    const syncData: SyncDataType | undefined = syncTypes.find(
      (item) => item.type === data[0]?.type
    );
    if (!isUndefined(syncData)) {
      setSynctype(syncData?.value);
      setSyncstatus(data[0]?.status);
      if (isUndefined(data[0].file_path)) {
        setfilePath(data[0]?.file_path);
        localStorage.setItem("filePath", data[0]?.file_path);
      }
      if (isUndefined(data[0].file_id)) {
        setFileId(data[0]?.file_id);
        localStorage.setItem("fileId", data[0]?.file_id);
      }
      setDetail(data[0]?.detail);
    } else {
      await getfileid();
    }
    console.log("interval", intervalID);
  };

  const saveSync = () => {
    const nowMs = new Date().getTime();
    // const nowTime = msToTimeString(nowMs);
    const syncdata = syncTypes.find((item) => item.value === synctype);
    invoke("insert_sync_info", {
      fileId,
      filePath,
      type: syncdata?.type,
      detail,
      status: syncstatus,
      createOn: nowMs.toString(),
    });
    clearInterval(intervalID);
    setSync(!sync);
  };

  return (
    <div className="flex-grow bg-white p-4 h-[80vh] rounded-tl-xl text-black">
      <div className="flex-grow bg-white p-6">
        <h1 className="text-4xl font-bold">Settings</h1>
        <div className="border-b-2 mt-4 mb-6"></div>
        <div className="flex">
          <div className="w-1/2 bg-gray-50 rounded-lg m-2">
            {/* Content for the left half */}
            <div className="flex flex-col p-4">
              <h2 className="text-2xl font-bold mb-1">File path</h2>
              <p className="text-gray-700 mb-5 text-xm">Select a file path:</p>
              <p className="text-gray-700 mb-2 text-xs">path:</p>
              <div className="m-2 self-stretch bg-white h-14 flex flex-row items-center justify-center py-0 px-4 box-border gap-[10px] text-base">
                <input
                  className="flex-1 relative p-2.5  bg-white"
                  placeholder="Please select directory to sync cloud database"
                  type="text"
                  value={filePath}
                  onChange={() => {}}
                />
                <button className="rounded bg-gray-50 hover:text-white hover:bg-indigo-800 text-indigo-800 h-10 flex flex-row items-center justify-center py-0 px-4 box-border text-navy-100">
                  <label htmlFor="files" className="btn">
                    Browse Files
                  </label>
                  <input
                    id="files"
                    style={{ display: "none" }}
                    type="file"
                    onClick={async (e) => {
                      await handleChange(e);
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 bg-gray-50 rounded-lg m-2">
            {/* Content for the right half */}
            <div className="flex flex-col p-4">
              <div className="flex flex-row justify-between">
                <div className="">
                  <h2 className="text-2xl font-bold mb-1">Auto Sync</h2>
                  <p className="text-gray-700 mb-5 text-xm">
                    Set auto sync setting:
                  </p>
                </div>
                <div className="px-4 py-4 h">
                  <Toggle
                    checked={syncstatus}
                    onChange={(e, checked) => setSyncstatus(checked)}
                  />
                </div>
              </div>

              <div className="flex flex-row">
                <div className=" w-1/2">
                  <p className="text-gray-700 ml-2 mr-2 mb-2 text-xs">
                    Sync Period:
                  </p>
                  <SelectInput
                    status={syncstatus}
                    type={synctype}
                    settype={handleSyncType}
                  />
                </div>
                <div className=" w-1/2 pl-8 pr-4">
                  <p className="text-gray-700 mb-2 text-xs">Sync Time:</p>
                  <SelectDetail
                    status={syncstatus}
                    type={synctype}
                    detail={detail}
                    setDetail={setDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end mr-4">
        <button
          className="border border-gray-200 text-black hover:border-[#190482] hover:text-[#190482] font-bold py-2 px-4 rounded m-4 p-4"
          onClick={getData}
        >
          Cancel
        </button>
        <button
          className="border border-gray-200 text-black  hover:border-[#190482] hover:text-[#190482] font-bold py-2 px-4 rounded m-4 p-4"
          onClick={saveSync}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
