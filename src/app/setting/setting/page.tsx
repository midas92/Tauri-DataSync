"use client";
import React from "react";
import Image from "next/image";
import Toggle from "@/components/toggle";
import SelectInput from "@/components/select";
import TimePicker from "@/components/timepicker";
import { useSession, signOut, signIn } from "next-auth/react";
import googleIcon from "../../../../public/google.svg";
import { redirect } from "next/navigation";
import { open } from "@tauri-apps/api/dialog";
import { fs, invoke } from "@tauri-apps/api";
import { isNull } from "lodash";

export default function Home() {
  const { data: session }: any = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/setting/auth");
    },
  });
  const handleChange = async (e: any) => {
    e.preventDefault();
    const file = await open({
      title: "Select Database file",
      directory: false,
      multiple: false,
      filters: [
        {
          name: "Image",
          extensions: ["db", "jpeg"],
        },
      ],
    });
    console.log('dddd')
    const metadata = {
      name: "dddd", // Set the desired title of the file
    };
    // console.log("file", file,session?.accessToken);
    // console.log('blob',new Blob([JSON.stringify(metadata)], { type: "application/json" }))
    if (!isNull(file)) {
      let res : any = await invoke("google_drive_upload", {
        path: file,
        token: session?.accessToken,
      });
      let fileId = res?.id;
      console.log(fileId);      
      let res1: any = await invoke("google_drive_update_metadata",{
        path: file,
        token: session?.accessToken,
        fileid:fileId,
      })
      console.log("res1",res1)
    }
    
  };
  const handleFiles = async (files: any) => {
    const file = files[0];
    console.log("file", file);

    const metadata = {
      name: file.name, // Set the desired title of the file
    };

    const body = new FormData();
    body.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    body.append("file", file);

    try {
      await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          body: body,
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      //show message
    } catch (error) {
      //show message
    }
  };
  return (
    <div className="flex-grow bg-white p-4 h-[80vh] rounded-tl-xl text-black">
      {/* Content for the second div */}
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
                  placeholder="C:\User\AppData\Config.txt"
                  type="text"
                />
                <button className="rounded bg-gray-50 hover:text-white hover:bg-indigo-800 text-indigo-800 h-10 flex flex-row items-center justify-center py-0 px-4 box-border text-navy-100">
                  <label htmlFor="files" className="btn">
                    Browse Files
                  </label>
                  <input
                    id="files"
                    style={{ display: "none" }}
                    type="file"
                    onClick={handleChange}
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
                  <Toggle />
                </div>
              </div>

              <div className="flex flex-row">
                <div className=" w-1/2">
                  <p className="text-gray-700 ml-2 mr-2 mb-2 text-xs">
                    Sync Period:
                  </p>
                  <SelectInput />
                </div>
                <div className=" w-1/2 pl-8 pr-4">
                  <p className="text-gray-700 mb-2 text-xs">Sync Time:</p>
                  <TimePicker />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end mr-4">
        <button className="border border-gray-200 text-black hover:border-[#190482] hover:text-[#190482] font-bold py-2 px-4 rounded m-4 p-4">
          Cancel
        </button>
        <button className="border border-gray-200 text-black  hover:border-[#190482] hover:text-[#190482] font-bold py-2 px-4 rounded m-4 p-4">
          Save changes
        </button>
      </div>
    </div>
  );
}
