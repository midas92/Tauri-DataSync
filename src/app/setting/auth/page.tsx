"use client";
import Image from "next/image";

import { useSession, signOut, signIn } from "next-auth/react";
import googleIcon from "../../../../public/google.svg";
import { redirect } from "next/navigation";
import { routes } from "@/constants/router";
import { Button } from "@mui/material";

export default function Auth() {
  const { data: session } = useSession();
  if (session) {
    redirect(routes.setting);
  } else {
    // signIn("google", { callbackUrl: "/setting/setting" });
  }
  return (
    <div className="flex-grow bg-white p-4 h-[80vh] rounded-tl-xl text-black flex justify-center m-10 flex-col mt-auto mb-auto ">
      <p className=" text-xl text-center">
        Please login with Google Account which you want to sync data on Google
        Drive.
      </p>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/setting/setting" })}
        className="text-lg w-auto"
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
        Login with google
      </Button>
    </div>
  );
}
