import React from "react";
import Image from "next/image";
import Link from "next/link";
import {routes} from "@/constants/router"
import {signOut} from 'next-auth/react'
const Navbar: React.FC = () => {
  return (
      <div className="w-1/5 bg-gray-100 h-screen">
        {/* First div */}
        <div className="m-1 p-1 h-[20vh] mb-0 pb-0 mt-0 pt-0">
             <Image src="/logo2.png" alt="My Image" className="w-full h-full object-contain" width={70} height={70} />
        </div>
        <div className="m-1 p-1 h-800 mt-0 pt-0">
          {/* Content for the second div */}
          <div className="flex flex-col p-5">
            <Link href={routes.setting} className=" p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg mb-2">
              Settings
            </Link>
            <Link href={routes.logs} className="p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg mb-2">
              Logs
            </Link>
            <Link href={routes.login} className="p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg" onClick={()=>signOut()}>Logout</Link>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
