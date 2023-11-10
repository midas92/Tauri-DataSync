import React from "react";
import Image from "next/image";

const Settings: React.FC = () => {
  return (
    <div className="flex">
      {/* Navbar */}
      <div className="w-1/5 bg-white-200 h-screen">
        {/* First div */}
        <div className="m-7 p-4 h-200 bg-white-500">
          {/* Content for the first div */}
          <div className="flex flex-row p-3">
            <div>
              {" "}
              <Image src="/logo.png" alt="My Image" width={70} height={70} />
            </div>
            <div className="text-indigo-800 font-semibold text-center p-4 text-3xl">
              App Name
            </div>
          </div>
        </div>

        {/* Second div */}
        <div className="m-2 p-4 h-800 bg-white-500">
          {/* Content for the second div */}
          <div className="flex flex-col p-5">
            <button className="p-6 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-blue-600 rounded">Settings</button>
            <button className="p-6 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-blue-600 rounded">Logs</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-gray-100 h-screen">{/* Main content */}</div>
    </div>
  );
};

export default Settings;
