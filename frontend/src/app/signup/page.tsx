"use client";

import Image from "next/image";
import BrownHoodie from "../../../public/images/brownHoodie.jpeg";
import LongButton from "@/components/long-button";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, Google } from "@/components/icons";

const SignupForm = dynamic(async () => import("./form"), { ssr: false });
export default function Signup(): JSX.Element {
  const [withEmail, setWithEmail] = useState(false);

  function handleContinueWithEmail(): void {
    setWithEmail(true);
  }

  function handleBackToEmail(): void {
    setWithEmail(false);
  }

  return (
    <>
      {" "}
      <section className="h-screen w-screen lg:flex">
        {/* Left Side */}
        <div className="h-full px-6 lg:basis-2/5 bg-brown-100 flex flex-col ">
          <div
            className={`h-10 w-10 mt-14 border rounded-full border-brown-500/30 flex justify-center items-center ${
              withEmail ? "visible" : "hidden"
            }`}
          >
            <button onClick={handleBackToEmail}>
              {" "}
              <ChevronLeft />
            </button>
          </div>
          <div className="max-w-sm mx-auto flex flex-col flex-grow justify-center">
            <div className=" ">
              {/* Sign Up Buttons Begins */}
              <div className={`${withEmail ? "hidden" : "visible"}`}>
                <h2 className="font-causten-bold mb-10 text-2xl">
                  Sign up to Rolling
                </h2>
                <LongButton
                  text="Sign up with Google"
                  onClick={(): void => console.log("Sign Up with Google")}
                  width="full"
                >
                  <Google className="h-6 w-6" />
                </LongButton>
                <div className="inline-flex items-center justify-center w-full relative">
                  <hr className=" w-full h-px my-7 bg-brown-400/20 border-0 " />
                  <span className="absolute px-3 font-causten-medium text-brown-500 -translate-x-1/2 bg-brown-100 left-1/2 ">
                    or
                  </span>
                </div>
                <LongButton
                  text="Continue with email"
                  width="full"
                  type="outline"
                  onClick={handleContinueWithEmail}
                />
                <p className="font-causten-medium text-sm text-center mt-7">
                  By continuing you agree to Rolling’s{" "}
                  <Link href="#" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              {/* Sign Up Buttons ends */}

              {/* Form Begins */}
              <div className={`${withEmail ? "visible" : "hidden"}`}>
                <SignupForm />
              </div>

              {/* Form Ends */}
              <div className="mt-5">
                <p className="font-causten-medium text-lg text-center">
                  Already have an account?{" "}
                  <Link href="/signin" className="underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="hidden lg:basis-3/5 lg:block relative">
          <div className="w-full h-full">
            <Image
              src={BrownHoodie}
              priority
              alt="BrownHoodie"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
