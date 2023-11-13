import React from "react";
const Header: React.FC = () => {
  return (
        <div className="m-2 p-2 h-160 bg-white-100 flex justify-end items-center pr-4">
          <div className="m-4 p-2 h-300">
            <span className="m-2 p-2 text-[#190482] ">
              Last sync: 5 min ago
            </span>
            <button className="m-2 p-2 bg-[#190482] text-gray-100 hover:bg-[#5c49bd] font-bold py-2 px-4 rounded">
              Sync Now
            </button>
          </div>
        </div>
      );
};

export default Header;
