"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Success from "@/components/notification/success";
import Failed from "@/components/notification/failed";
import Licensebadge from "@/components/license/status";
import LicenseModal from "@/components/license/modal";
import Login from "@/components/login";
import { routes } from "@/constants/router";
import { AUTH } from "@/constants/message";

export default function Home() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("a");
  const [showModal, setShowModal] = useState(false);
  const [alert, showAlert] = useState({
    warn: false,
    message: "Checking license ...",
  });
  const [showNotificationOfSuccess, setShowNotificationOfSuccess] =
    useState(false);
  const [showNotificationOfFailed, setShowNotificationOfFailed] =
    useState(false);
  const [showNotificationOfError, setShowNotificationOfError] = useState(false);
  const [showNotificationOfMissMatch, setShowNotificationOfMissMatch] = useState(false);
  const [licensevalidate, setLicensevalidate] = useState(false);
  const [refreshLogin, setRefreshLogin] = useState(true)
  const router = useRouter();

  const checkLisence = useCallback(async () => {
    let licenseKey = localStorage.getItem("licensekey");
    let data: any;
    console.log("erererer", email)
    if (licenseKey !== null && licenseKey !== "") {
      const postData = { license_key: licenseKey };
      try {
       const license = await fetch(
          "https://api.lemonsqueezy.com/v1/licenses/validate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          }
        );
        console.log('check', email, license.ok)
        if(!license.ok && email !== ""){
          console.log('error')
          setShowNotificationOfMissMatch(true);
        }
        data = await license.json();
      } catch (err) {
        setShowNotificationOfError(true);
      }
    } else {
      data = { valid: false };
    }
    if (data?.valid) {
      setUserEmail(data?.meta?.customer_email);
      setLicensevalidate(true);
      showAlert({ warn: false, message: "License is valid" });
    } else {
      setLicensevalidate(false);
      showAlert({ warn: true, message: "License is invalid" });
    }
  }, [email]);

  useEffect(() => {
    checkLisence();
  }, []);

  const checkEmail = useCallback(() => {
    if (email !== "") {
        if (userEmail.toLowerCase() === email.toLowerCase()) {
          setShowNotificationOfSuccess(true);
          // message login success
          router.push(routes.auth);
        } else {
          if (licensevalidate) {
            setShowNotificationOfFailed(true);
            // message login failed
          } else {
            //input license
            setShowModal(true);
          }
        }
    }
  }, [email, licensevalidate]);
  useEffect(() => {
    checkEmail();
  }, [checkEmail]);

  const handleLicenseSubmit = async () => {
    await checkLisence();
    setShowModal(false);
  };

  const handleCloseNotificationOfSuccess = () => {
    setShowNotificationOfSuccess(false);
  };

  const handleCloseNotificationOfFailed = () => {
    setShowNotificationOfFailed(false);
  };
  const handleCloseNotificationOfError = () => {
    setShowNotificationOfError(false);
  };
  const handleCloseNotificationOfMissMatch = () => {
    setShowNotificationOfMissMatch(false);
  };

  return (
    <div className="relative bg-white w-full min-h-screen overflow-hidden text-left text-base text-midnightblue font-roboto">
      <Login getEmail={async (e: string) => {setEmail(''); setTimeout(() => setEmail(e), 500); }}/>
      <Licensebadge alert={alert} />
      <Success
        message={AUTH.SUCCESS}
        showNotification={showNotificationOfSuccess}
        onCloseNotification={handleCloseNotificationOfSuccess}
      />
      <Failed
        message={AUTH.WRONG_EMAIL}
        showNotification={showNotificationOfFailed}
        onCloseNotification={handleCloseNotificationOfFailed}
      />
      <Failed
        message={AUTH.INTERNET_ERROR}
        showNotification={showNotificationOfError}
        onCloseNotification={handleCloseNotificationOfError}
      />
      <Failed
        message={AUTH.WRONG_LICENSE}
        showNotification={showNotificationOfMissMatch}
        onCloseNotification={handleCloseNotificationOfMissMatch}
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
