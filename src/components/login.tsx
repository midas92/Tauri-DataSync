"use client";
import * as React from "react";
import { useState } from "react";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [licenseId, setLicenseId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");

  const handleLogin = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setLicenseId("");
    setLicenseKey("");
  };

  const handleLicenseSubmit = () => {
    // Handle license submission logic here
    console.log("License ID:", licenseId);
    console.log("License Key:", licenseKey);
    handleModalClose();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-1/2">
        <Image
          src="/image.png"
          alt="Image"
          layout="responsive"
          width={500}
          height={500}
        />
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <div className="items-center justify-center">
          <div className="mb-4 flex justify-center items-center">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="w-24 h-24 rounded-md"
            />
          </div>
          <form className="w-full">
            <div className="mb-4">
              <div className="text-4xl flex justify-center items-center">Welcome!</div>
              <div className="text-sm text-gray-400 flex justify-center items-center">Enter your email address to login</div>
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 px-4 py-2 w-full"
              />
            </div>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-12 rounded">
            <h2 className="text-3xl font-bold mb-1">License</h2>
            <p className="text-gray-700 mb-5 text-xs">Enter license ID and key:</p>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">License ID</label>
              <input
                type="text"
                placeholder="Enter ID"
                className="border border-gray-300 px-4 py-2 w-full"
                value={licenseId}
                onChange={(e) => setLicenseId(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">License Key</label>
              <input
                type="text"
                placeholder="Enter Key"
                className="border border-gray-300 px-4 py-2 w-full"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
              />
            </div>
            <div className=" flex justify-center items-center">
            <button
              type="button"
              className="bg-blue-500 text-white px-12 py-2 rounded"
              onClick={handleLicenseSubmit}
            >
              Enter
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
