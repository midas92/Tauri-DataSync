"use client";
import Image from "next/image";

import { useSession, signOut, signIn } from "next-auth/react";
import googleIcon from "../../../../public/google.svg";

export default function Auth() {
  return (
    <div className="">
      <button
        onClick={() => signIn("google", { callbackUrl: "/setting/setting" })}
        className="button"
      >
        <Image src={googleIcon} width={22} height={22} alt="" />
        Login with google
      </button>
    </div>
  );
}
