import React from "react";
import Image from "next/image";
import Togglebutton from "./toggle";
const SettingContent: React.FC = () => {
  return (
    <div className="flex-grow bg-gray-100 ml-8 p-4 rounded-tl-xl">
      {/* Content for the second div */}
      <div className="flex-grow bg-gray-100 p-6">
        <h1 className="text-4xl font-bold">Settings</h1>
        <div className="border-b-2 mt-4 mb-6"></div>
        <div className="flex">
          <div className="w-1/2 bg-gray-200 rounded-lg m-2">
            {/* Content for the left half */}
            <div className="flex flex-col p-4">
              <h2 className="text-2xl font-bold mb-1">File path</h2>
              <p className="text-gray-700 mb-5 text-xm">Select a file path:</p>
              <p className="text-gray-700 mb-2 text-xs">path:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  className="border border-gray-400 px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-gray-500 flex-grow"
                  placeholder="Enter file path"
                />
                <button className="bg-gray-300 text-indigo-800 font-bold py-2 px-4 rounded-r">
                  Change
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 bg-gray-200 rounded-lg m-2">
            {/* Content for the right half */}
            <div className="flex flex-col p-4">
              <div className="flex flex-row justify-between">
                <div className="">
                  <h2 className="text-2xl font-bold mb-1">Auto Sync</h2>
                  <p className="text-gray-700 mb-5 text-xm">
                    Set auto sync setting:
                  </p>
                </div>
                <div className="">
                  <Togglebutton />
                </div>
              </div>

              <div className="flex flex-row">
                <div className="ml-12 w-1/2">
                  <p className="text-gray-700 mb-2 text-xs">Sync Period:</p>
                  <select className=" border-gray-400 pl-6 pr-12 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 flex-grow">
                    <option className="text-left">Daily</option>
                    <option className="text-left">Option 2</option>
                    <option className="text-left">Option 3</option>
                  </select>
                </div>
                <div className="ml-12 w-1/2">
                  <p className="text-gray-700 mb-2 text-xs">Sync Time:</p>
                  <input
                    type="time"
                    className=" border-gray-400 px-12 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 flex-grow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end mr-4">
        <button className="bg-gray-300 text-indigo-800 font-bold py-2 px-4 rounded m-4 p-4">
          Cancel
        </button>
        <button className="bg-gray-300 text-indigo-800 font-bold py-2 px-4 rounded m-4 p-4">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default SettingContent;
