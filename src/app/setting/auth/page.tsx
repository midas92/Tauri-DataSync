"use client";
import { redirect } from "next/navigation";
import { routes } from "@/constants/router";
import { Button } from "@mui/material";
import { login, refreshAccessToken } from "@/services/auth";
import { useContext, useEffect } from "react";
import { SyncContext } from "@/app/setting/layout";
import { isEmpty, isUndefined } from "lodash";

export default function Auth() {
  const { token, setToken } = useContext(SyncContext);
  const loginRust = () => {
    login(setToken);
  };
  useEffect(() => {
    if (!isUndefined(token?.access_token) && !isEmpty(token?.access_token)) {
      if (token?.expiration > Date.now()) {
        redirect(routes.setting);
      } else {
        console.log("token", token);
        refreshAccessToken(token, setToken);
      }
    }
  }, [token]);
  return (
    <div className="flex-grow bg-white p-4 h-[80vh] rounded-tl-xl text-black flex justify-center m-10 flex-col mt-auto mb-auto ">
      <p className=" text-xl text-center">
        Please login with Google Account which you want to sync data on Google
        Drive.
      </p>
      <Button
        onClick={loginRust}
        className="text-lg w-auto "
        variant="contained"
        color="success"
        style={{
          width: "350px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        Login with google with rust
      </Button>
    </div>
  );
}
