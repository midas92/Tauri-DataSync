import {
  getLastModifiedDate,
  msToTimeString,
  getGoogleDriveFileInfo,
} from "@/app/setting/setting/page";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useContext, useState } from "react";
import { isEmpty, isNull, isUndefined } from "lodash";
import { syncTypes } from "@/constants/sync";
import { Sync, SyncDataType } from "@/types/sync";
import { SyncContext } from "@/app/setting/layout";
import { refreshAccessToken } from "@/services/auth";
import Success from "@/components/notification/success";
import Failed from "@/components/notification/failed";
import { SYNC } from "@/constants/message";

const Header: React.FC = () => {
  let {
    sync,
    setIntervalID,
    token,
    setToken,
    setRefreshLog,
    refreshLog,
    showNotificationOfFailed,
    setShowNotificationOfFailed,
    showNotificationOfSuccess,
    setShowNotificationOfSuccess,
  } = useContext(SyncContext);
  let callSync = false;
  const [filePath, setfilePath] = useState("");
  const [fileId, setFileId] = useState("");
  const [syncbtnstatus, setSyncBtnStatus] = useState(false);
  const [showNotificationOfRecommend, setShowNotificationOfRecommend] =
    useState(false);
  const syncData = async (type = "Manual") => {
    if (!isEmpty(filePath) && !isEmpty(fileId) && !isNull(token.access_token)) {
      console.log("start sync");
      await refreshAccessToken(token, setToken);
      const fileMetadata = await getLastModifiedDate(filePath);
      console.log(fileMetadata, "filemetadata");
      const nowLocalTime = msToTimeString(new Date().getTime());
      const cloudFileInfo = await getGoogleDriveFileInfo(fileId, token);
      const filename = cloudFileInfo?.name.split("--");
      console.log("cloud", filename);
      const cloudModified = msToTimeString(parseInt(filename[1]));
      if ((fileMetadata || 0) > filename[1]) {
        //upload
        console.log("upload update");
        console.log("cloudModified", cloudModified);
        try {
          let res: any = await invoke("google_drive_update_content", {
            path: filePath,
            token: token?.access_token,
            fileid: fileId,
          });
          console.log("update_content", res);
          let res1: any = await invoke("google_drive_update_metadata", {
            path: filePath,
            token: token?.access_token,
            fileId: fileId,
            mtime: fileMetadata?.toString(),
          });
          console.log("res1", res1);
          await invoke("insert_log", {
            drive: "google",
            actionType: type,
            create: nowLocalTime,
            prev: cloudModified,
            upload: "upload",
            path: filePath,
          });
          setShowNotificationOfSuccess(true);
          console.log("create log to upload");
        } catch (err) {
          console.log(err);
          setShowNotificationOfFailed(true);
        }
      } else {
        // download
        try {
          console.log("file download");
          await invoke("google_drive_download", {
            path: filePath.toString(),
            token: token?.access_token,
            fileid: fileId,
            filepath: true,
          });
          await invoke("insert_log", {
            drive: "google",
            actionType: type,
            create: nowLocalTime,
            prev: cloudModified,
            upload: "download",
            path: filePath,
          });
          setShowNotificationOfSuccess(true);
          console.log("create log to download");
        } catch (err) {
          console.log(err);
          setShowNotificationOfFailed(true);
        }
      }
      setRefreshLog(!refreshLog);
    } else {
      setShowNotificationOfRecommend(true);
    }
  };
  useEffect(() => {
    setfilePath(localStorage.getItem("filePath") || "");
    setFileId(localStorage.getItem("fileId") || "");
    getSyncData();
  }, [sync]);

  useEffect(() => {
    if (!isUndefined(token?.access_token) && !isEmpty(token?.access_token)) {
      if (token?.expiration > Date.now()) {
        setSyncBtnStatus(true);
      }
    }
  }, [token]);
  const getSyncData = async () => {
    callSync = !callSync;
    if (callSync) {
      const data: Array<Sync> = await invoke("get_sync");
      console.log("data", data);
      const syncDataValue: SyncDataType | undefined = syncTypes?.find(
        (item) => item.type === data[0]?.type
      );
      const setTime = new Date(data[0]?.create_on);
      if (data[0]?.status) {
        if (syncDataValue?.type === "Daily") {
          await getFirstSynctime(setTime, "Daily", data[0].detail, data[0].id);
          const intervalID = setInterval(async () => {
            console.log("Daily");
            await runSyncData("Daily", data[0].detail);
            await invoke("update_sync_create_on", {
              id: data[0].id,
              time: new Date().getTime().toString(),
            });
          }, 1000 * 60);
          setIntervalID(intervalID);
        } else if (syncDataValue?.type === "Weekly") {
          await getFirstSynctime(setTime, "Weekly", data[0].detail, data[0].id);
          const intervalID = setInterval(async () => {
            console.log("Weekly");
            await runSyncData("Weekly", data[0].detail);
            await invoke("update_sync_create_on", {
              id: data[0].id,
              time: new Date().getTime().toString(),
            });
          }, 1000 * 60 * 60);
          setIntervalID(intervalID);
        } else if (syncDataValue?.type === "Monthly") {
          await getFirstSynctime(
            setTime,
            "Monthly",
            data[0].detail,
            data[0].id
          );

          const intervalID = setInterval(async () => {
            console.log("Monthly");
            await runSyncData("Monthly", data[0].detail);
            await invoke("update_sync_create_on", {
              id: data[0].id,
              time: new Date().getTime().toString(),
            });
          }, 1000 * 60 * 60 * 24);
          setIntervalID(intervalID);
        }
      }
    }
  };
  const runSyncData = async (type: string, detail: number) => {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const weekday = now.getDay();
    const day = now.getDate();
    if (type === "Daily") {
      if (detail * 6 === hour && min === 0) {
        await syncData("Daily");
      }
    } else if (type === "Weekly") {
      if (weekday === detail && hour === 12) {
        await syncData("Weekly");
      }
    } else if (type === "Monthly") {
      if (day % 10 === 0 && detail === 0 && hour === 12) {
        await syncData("Monthly");
      } else if (day % 15 === 0 && detail === 1 && hour === 12) {
        await syncData("Monthly");
      }
    }
  };
  const getFirstSynctime = async (
    setDate: Date,
    type: string,
    detail: number,
    id: number
  ) => {
    const now = new Date();
    const setWeekday = setDate.getDay();
    const setDay = setDate.getDate();

    if (type === "Daily") {
      setDate.setHours(detail * 6, 0, 0, 0);
      now.setMinutes(0, 0, 0);
      if (now.getTime() >= setDate.getTime()) {
        await syncData("Daily");
        await invoke("update_sync_create_on", {
          id,
          time: new Date().getTime().toString(),
        });
      }
    } else if (type === "Weekly") {
      const nextdate =
        detail - setWeekday ? detail - setWeekday : detail - setWeekday + 6;
      if (now.getDate() >= setDay + nextdate) {
        await syncData("Weekly");
        await invoke("update_sync_create_on", {
          id,
          time: new Date().getTime().toString(),
        });
      }
    } else if (type === "Monthly") {
      if (now.getDate() % 10 === 0 && detail === 0 && now.getDate() > setDay) {
        await syncData("Monthly");
        await invoke("update_sync_create_on", {
          id,
          time: new Date().getTime().toString(),
        });
      } else if (
        now.getDate() % 15 === 0 &&
        detail === 1 &&
        now.getDate() > setDay
      ) {
        await syncData("Monthly");
        await invoke("update_sync_create_on", {
          id,
          time: new Date().getTime().toString(),
        });
      }
    }
  };

  return (
    <>
      <div className="m-2 p-2 h-160 bg-gray-100 flex justify-end items-center pr-4">
        <div className="m-4 p-2 h-300">
          {/* <span className="m-2 p-2 text-[#190482] ">Last sync: 5 min ago</span> */}
          <button
            className="m-2 p-2 bg-[#190482] text-gray-100 hover:bg-[#5c49bd] font-bold py-2 px-4 rounded-md"
            onClick={async () => await syncData()}
            hidden={!syncbtnstatus}
          >
            Sync Now
          </button>
        </div>
      </div>
      <Success
        message={SYNC.SUCCESS}
        showNotification={showNotificationOfSuccess}
        onCloseNotification={() => setShowNotificationOfSuccess(false)}
      />
      <Failed
        message={SYNC.FAILED}
        showNotification={showNotificationOfFailed}
        onCloseNotification={() => setShowNotificationOfFailed(false)}
      />
      <Failed
        message={SYNC.RECOMMEND}
        showNotification={showNotificationOfRecommend}
        onCloseNotification={() => setShowNotificationOfRecommend(false)}
      />
    </>
  );
};

export default Header;
