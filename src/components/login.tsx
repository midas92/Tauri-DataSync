"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Success from "./notification/success";
import Failed from "./notification/failed";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [licenseId, setLicenseId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const router = useRouter();
  const handleLogin = () => {
    setShowModal(true);
  };
  const showNotification = (state:string) => {
    if(state==="success") {
      setShowNotificationOfSuccess(true);
    }
    else if(state==="failed"){
      setShowNotificationOfFailed(true);
    } else {
      return false;
    }

  }
  const handleModalClose = () => {
    setShowModal(false);
    showNotification("success");
    setTimeout(() => {
      router.push("/setting/setting"); // Replace '/setting/setting' with your actual next page URL
    }, 3000);
    setLicenseId("");
    setLicenseKey("");
  };

  const handleLicenseSubmit = () => {
    // Handle license submission logic here
    console.log("License ID:", licenseId);
    console.log("License Key:", licenseKey);

    handleModalClose();
  };

  const handleModalOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setShowModal(false);
    }
  };

  const [showNotificationOfSuccess, setShowNotificationOfSuccess] = React.useState(false);
  const handleCloseNotificationOfSuccess = () => {
    setShowNotificationOfSuccess(false);
  };

  const [showNotificationOfFailed, setShowNotificationOfFailed] = React.useState(false);
  const handleCloseNotificationOfFailed = () => {
    setShowNotificationOfFailed(false);
  };

  return (
    <div className="relative bg-white w-full min-h-screen overflow-hidden text-left text-base text-midnightblue font-roboto">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Image
          className="absolute top-0 left-0 right-auto bottom-auto rounded-tl-none rounded-tr-xl rounded-br-xl rounded-bl-none w-[50vw] h-full object-cover"
          alt=""
          src="/image.png"
          width={50}
          height={50}
        />
        <div className="w-full  ml-[60vw] mr-[13vw] py-8 px-4 sm:px-8">
          <div className="rounded-lg bg-gray-100 w-20 h-20 mx-auto flex items-center justify-center">
            <Image
              className="w-12 h-12"
              alt=""
              src="/user.svg"
              width={50}
              height={50}
            />
          </div>
          <div className="mt-8 text-center text-4xl ">
            <h2 className="text-7xl font-bold">Welcome!</h2>
            <p className="mt-2 text-base text-opacity-64">
              Enter your email address to login
            </p>
          </div>
          <form className="mt-8">
            <input
              className="rounded bg-gray-100 w-full py-2 px-5 mb-5 "
              placeholder="Email address"
              type="email"
            />

            <button
              className="bg-blue-800  rounded w-full py-2 px-5 text-white mb-5"
              onClick={handleLogin}
              type="button"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
      <Success
        showNotification={showNotificationOfSuccess}
        onCloseNotification={handleCloseNotificationOfSuccess}
      />
      <Failed
        showNotification={showNotificationOfFailed}
        onCloseNotification={handleCloseNotificationOfFailed}
      />
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 text-black"
          onClick={handleModalOverlayClick}
        >
          <div className="bg-white p-12 rounded">
            <h2 className="text-3xl font-bold mb-1">License</h2>
            <p className="text-gray-700 mb-6 text-xs">
              Enter license ID and key:
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold">
                License ID
              </label>
              <input
                type="text"
                placeholder="Enter ID"
                className="border border-gray-300 px-4 py-2 w-full"
                value={licenseId}
                onChange={(e) => setLicenseId(e.target.value)}
              />
            </div>
            <div className="mb-12">
              <label className="block text-gray-700 font-bold">
                License Key
              </label>
              <input
                type="text"
                placeholder="Enter Key"
                className="border border-gray-300 px-4 py-2 w-full"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
              />
            </div>
            <div className="mb-12">
              <button
                type="button"
                className="bg-blue-500 text-white w-full px-12 py-2 rounded"
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
