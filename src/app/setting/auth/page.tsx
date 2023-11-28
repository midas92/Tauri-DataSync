"use client";
import Image from "next/image";

import { useSession, signOut, signIn } from "next-auth/react";
import googleIcon from "../../../../public/google.svg";
import { redirect } from "next/navigation";
import { routes } from "@/constants/router";

export default function Auth() {
  const { data: session } = useSession();
  if (session) redirect(routes.setting);
  return (
    <div className=" text-black">
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
