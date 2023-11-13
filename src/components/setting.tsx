import React from "react";
import Image from "next/image";
import Toggle from "./toggle";
import SelectInput from "./select"
import TimePicker from "./timepicker";
const Setting: React.FC = () => {
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
                  <div className="relative">Change</div>
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
                  <p className="text-gray-700 ml-2 mr-2 mb-2 text-xs">Sync Period:</p>
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
};

export default Setting;
