import React from "react";
import Image from "next/image";
import Logscontent from "./logscontent";
import Header from "./header";
import Navbar from "./navbar";
const Logs: React.FC = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="w-4/5 bg-gray-200 h-screen">
        <Header />
        <Logscontent />
      </div>
    </div>
  );
};

export default Logs;