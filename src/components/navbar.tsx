import React from "react";
import Image from "next/image";
const Navbar: React.FC = () => {
  return (
      <div className="w-1/5 bg-white-200 h-screen">
        {/* First div */}
        <div className="m-1 p-1 h-100 bg-white-500 mb-0 pb-0 mt-0 pt-0">
             <Image src="/logo2.png" alt="My Image" className="w-full h-full object-contain" width={70} height={70} />
        </div>
        <div className="m-1 p-1 h-800 bg-white-500 mt-0 pt-0">
          {/* Content for the second div */}
          <div className="flex flex-col p-5">
            <button className="p-6 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-blue-600 rounded">
              Settings
            </button>
            <button className="p-6 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-blue-600 rounded">
              Logs
            </button>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
