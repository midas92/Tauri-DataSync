import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/constants/router";
import { logout } from "@/services/auth";
import { SyncContext } from "@/app/setting/layout";
import { isEmpty, isUndefined } from "lodash";

const Navbar: React.FC = () => {
  const { token } = useContext(SyncContext);
  const [user, setUser] = useState<boolean>(false);
  useEffect(() => {
    if (!isUndefined(token?.access_token) && !isEmpty(token?.access_token)) {
      if (token?.expiration > Date.now()) {
        setUser(true)
      }
    }
  }, [token]);
  return (
    <div className="w-1/5 bg-gray-100 h-screen">
      {/* First div */}
      <div className="m-1 p-1 h-[20vh] mb-0 pb-0 mt-0 pt-0">
        <Image
          src="/logo2.png"
          alt="My Image"
          className="w-full h-full object-contain"
          width={70}
          height={70}
        />
      </div>
      <div className="m-1 p-1 h-800 mt-0 pt-0">
        {/* Content for the second div */}
        <div className="flex flex-col p-5">
          <Link
            href={user ? routes.setting : routes.auth}
            className=" p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg mb-2"
          >
            Settings
          </Link>
          <Link
            href={user ? routes.logs : routes.auth}
            className="p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg mb-2"
          >
            Logs
          </Link>
          <Link
            href={routes.about}
            className="p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg mb-2"
            target="_blank"
          >
            About
          </Link>
          <Link
            href={routes.Help}
            className="p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg mb-2"
            target="_blank"
          >
            Help
          </Link>
          <Link
            href={routes.login}
            className="p-4 text-2xl text-gray-500 text-left hover:bg-gray-200 hover:text-[#190482] rounded-lg"
            onClick={() => logout()}
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
