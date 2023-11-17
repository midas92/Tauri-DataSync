"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Success from "@/components/notification/success";
import Failed from "@/components/notification/failed";
import Licensebadge from "@/components/license/status";
import LicenseModal from "@/components/license/modal";
import Login from "@/components/login";
import { routes } from "@/constants/router";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showNotificationOfSuccess, setShowNotificationOfSuccess] =
    useState(false);
  const [showNotificationOfFailed, setShowNotificationOfFailed] =
    useState(false);
  const [licensevalidate, setLicensevalidate] = useState(false);
  

  const router = useRouter();

  const checkLisence = useCallback(async () => {
    // const license = fetch('https://api.lemonsqueezy.com/v1/licenses/validate',{

    // })
    if (localStorage.getItem("aaa") === null) {
      const license = localStorage.setItem("aaa", "asssss");
    }
    console.log(localStorage.getItem("aaa") )
    setLicensevalidate(true);
  }, []);

  useEffect(()=>{
    checkLisence();
  },[checkLisence])
  const handleLogin = () => {
    ;
  };

  const handleLicenseSubmit = () => {
    //validation?

    setShowModal(false);
    // if (value === "success") {
    setShowNotificationOfSuccess(true);
    setTimeout(() => {
      router.push(routes.setting);
    }, 1000);
    // } else if (value === "failed") {
    //   setShowNotificationOfFailed(true);
    // }
  };

  const handleCloseNotificationOfSuccess = () => {
    setShowNotificationOfSuccess(false);
  };

  const handleCloseNotificationOfFailed = () => {
    setShowNotificationOfFailed(false);
  };

  return (
    <div className="relative bg-white w-full min-h-screen overflow-hidden text-left text-base text-midnightblue font-roboto">
      <Login showModal={()=>setShowModal(true)}  licenseState={licensevalidate}   />
      <Licensebadge
        state={false}
        alert={{ warn: true, message: "license invalid" }}
      />
      <Success
        showNotification={showNotificationOfSuccess}
        onCloseNotification={handleCloseNotificationOfSuccess}
      />
      <Failed
        showNotification={showNotificationOfFailed}
        onCloseNotification={handleCloseNotificationOfFailed}
      />
      {showModal && (
        <LicenseModal
          closeModal={() => setShowModal(false)}
          handleLicenseSubmit={handleLicenseSubmit}
        />
      )}
    </div>
  );
}
