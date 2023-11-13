import React from "react";
import Image from "next/image";
import Link from "next/link";
import {routes} from "@/constants/router"

const Navbar: React.FC = () => {
  return (
      <div className="w-1/5 bg-gray-50 h-screen">
        {/* First div */}
        <div className="m-1 p-1 h-[20vh] mb-0 pb-0 mt-0 pt-0">
             <Image src="/logo2.png" alt="My Image" className="w-full h-full object-contain" width={70} height={70} />
        </div>
        <div className="m-1 p-1 h-800 mt-0 pt-0">
          {/* Content for the second div */}
          <div className="flex flex-col p-5">
            <Link href={routes.setting} className="p-6 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded">
              Settings
            </Link>
            <Link href={routes.logs} className="p-6 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded">
              Logs
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
