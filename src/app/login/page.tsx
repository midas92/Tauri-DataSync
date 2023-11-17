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
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("a");
  const [showModal, setShowModal] = useState(false);
  const [showNotificationOfSuccess, setShowNotificationOfSuccess] =
    useState(false);
  const [showNotificationOfFailed, setShowNotificationOfFailed] =
    useState(false);
  const [licensevalidate, setLicensevalidate] = useState(false);

  const router = useRouter();

  const checkLisence = useCallback(async () => {
    let licenseKey = localStorage.getItem("licensekey");
    let licenseId = localStorage.getItem("licenseid");
    if (licenseKey !== null || licenseId !== null) {
      // const license = fetch('https://api.lemonsqueezy.com/v1/licenses/validate',{
      // })
      //setlocalstorage  key, id
      //setstate validstate
      //setstate useremail
    } else {
      setLicensevalidate(false);
    }
  }, []);

  useEffect(() => {
    checkLisence();
  }, [checkLisence]);

  useEffect(() => {
    if(userEmail === email){
      setShowNotificationOfSuccess(true)
      // message login success
      router.push(routes.setting);
    } else {
      if(licensevalidate) {
        // message login failed
      setShowNotificationOfFailed(true)
      } else {
        setShowModal(true);
      }
    }
  }, [userEmail]);

  useEffect(() => {
    if (licensevalidate) {
      setShowNotificationOfSuccess(true)
      // message license valid
    } else {
      setShowNotificationOfFailed(true)
      //message license invalid
    }
  }, [licensevalidate]);

  const handleLicenseSubmit = () => {
    checkLisence();
    setShowModal(false);
  };

  const handleCloseNotificationOfSuccess = () => {
    setShowNotificationOfSuccess(false);
  };

  const handleCloseNotificationOfFailed = () => {
    setShowNotificationOfFailed(false);
  };

  return (
    <div className="relative bg-white w-full min-h-screen overflow-hidden text-left text-base text-midnightblue font-roboto">
      <Login
        licenseState={licensevalidate}
        getEmail={(e: string) => setEmail(e)}
      />
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
