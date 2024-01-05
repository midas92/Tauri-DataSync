"use client";
import React, {KeyboardEvent} from "react";
import { useState } from "react";
import Image from "next/image";
import { HandleLogin } from "@/types/login";

export default function Login(props: HandleLogin) {
  const [email, setEmail] = useState("");
  const submit = () => {
    props.getEmail(email);
  };

  const handleKey = (e : KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <Image
        className="absolute top-0 left-0 right-auto bottom-auto rounded-tl-none rounded-tr-xl rounded-br-xl rounded-bl-none w-[50vw] h-full object-cover"
        alt=""
        src="/image.png"
        width={50}
        height={50}
      />
      <div className="w-full  ml-[60vw] mr-[13vw] py-8 px-4 sm:px-8 text-black">
        <div className="rounded-lg bg-gray-100 w-56 h-32 mx-auto flex items-center justify-center">
          <Image
            className="w-48 h-24"
            alt=""
            src="/logo.png"
            width={100}
            height={80}
          />
        </div>
        <div className="mt-8 text-center text-4xl ">
          <h2 className="xl:text-6xl font-bold md:text-4xl">Welcome!</h2>
          <p className="mt-2 md:text-base xl:text-xl text-opacity-64">
            Enter your email address to login
          </p>
        </div>
        <form className="mt-8">
          <input
            className="rounded-md bg-gray-100 w-full py-4 px-5 mb-5 xl:text-xl"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            className="bg-blue-800  rounded-md w-full py-4 px-5 text-white mb-5 xl:text-xl"
            onClick={submit}
            type="button"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
