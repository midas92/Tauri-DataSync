import React from "react";
import Image from "next/image";
import Datatable from "./datatable";
const Logscontent: React.FC = () => {
  return (
    <div className="flex-grow bg-gray-100 ml-8 p-4 rounded-tl-xl">
      {/* Content for the second div */}
      <div className="flex-grow bg-gray-100 p-6">
        <h1 className="text-4xl font-bold">Logs</h1>
        <div className="border-b-2 mt-4 mb-6"></div>
        <div className="flex">
            <Datatable/>
        </div>
      </div>
    </div>
  );
};

export default Logscontent;