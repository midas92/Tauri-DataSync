import {
  getLastModifiedDate,
  msToTimeString,
  getGoogleDriveFileInfo,
} from "@/app/setting/setting/page";
import { invoke } from "@tauri-apps/api";
import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { isEmpty, isUndefined } from "lodash";

const Header: React.FC = () => {
  const { data: session }: any = useSession({
    required: false,
  });
  const filePath = localStorage.getItem("filePath") || "";
  const fileId = localStorage.getItem("fileId") || "";
  console.log("session", session);
  const syncData = async () => {
    console.log("jijijijijijijijijij");
    if (!isEmpty(filePath) && !isEmpty(fileId) && !isUndefined(session)) {
      const fileMetadata = await getLastModifiedDate(filePath);
      console.log(fileMetadata, "filemetadata");
      const nowLocalTime = msToTimeString(new Date().getTime());
      const cloudFileInfo = await getGoogleDriveFileInfo(fileId, session);
      const filename = cloudFileInfo?.name.split("--");
      console.log("cloud", filename);
      const cloudModified = msToTimeString(parseInt(filename[1]));
      if (fileMetadata.mtimeMS > filename[1]) {
        //upload
        console.log("upload update");
        console.log("cloudModified", cloudModified);
        let res: any = await invoke("google_drive_update_content", {
          path: filePath,
          token: session?.accessToken,
          fileid: fileId,
        });
        console.log("update_content", res);

        let res1: any = await invoke("google_drive_update_metadata", {
          path: filePath,
          token: session?.accessToken,
          fileid: fileId,
          mtime: parseInt(fileMetadata?.mtimeMS).toString(),
        });
        console.log("res1", res1);
        await invoke("insert_log", {
          drive: "google",
          actionType: "manual",
          create: nowLocalTime,
          prev: cloudModified,
          upload: "upload",
          path: filePath,
        });
        console.log("create log to upload");
      } else {
        // download
        console.log("file download");
        await invoke("google_drive_download", {
          path: filePath.toString(),
          token: session?.accessToken,
          fileid: fileId,
          filepath: true,
        });
        await invoke("insert_log", {
          drive: "google",
          actionType: "manual",
          create: nowLocalTime,
          prev: cloudModified,
          upload: "download",
          path: filePath,
        });
        console.log("create log to download");
      }
    }
  };

  return (
    <div className="m-2 p-2 h-160 bg-gray-100 flex justify-end items-center pr-4">
      <div className="m-4 p-2 h-300">
        <span className="m-2 p-2 text-[#190482] ">Last sync: 5 min ago</span>
        <button
          className="m-2 p-2 bg-[#190482] text-gray-100 hover:bg-[#5c49bd] font-bold py-2 px-4 rounded-md"
          onClick={syncData}
        >
          Sync Now
        </button>
      </div>
    </div>
  );
};

export default Header;
