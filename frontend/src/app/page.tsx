import Image from "next/image";
import BrownHoodie from "../../public/images/brownHoodie.jpeg";
import GoogleLogo from "../../public/svgs/Google.svg";
import LongButton from "../components/long-button";

export default function Home() {
  return (
    <main className="">
      <section className="h-screen w-screen lg:flex">
        <div className="h-full px-6 lg:basis-2/5 bg-brown-100">
          <div className=" h-full max-w-md flex flex-col justify-center mx-auto">
            <div className=" flex flex-col ">
              <h2 className="font-causten-bold mb-10 text-2xl lg:text-3xl">
                Sign up to Rolling
              </h2>
              <LongButton
                text="Sign up with Google"
                logoSrc={GoogleLogo}
                backgroundColor="bg-brown-500"
              />
              <div className="flex items-center justify-center my-8">
                <div className="grow bg-brown-400 h-px"></div>
                <span className="font-causten-medium text-lg mx-2">or</span>
                <div className="grow bg-brown-400 h-px"></div>
              </div>
              <LongButton
                text="Continue with email"
                textColor="text-brown-500"
                border={true}
                borderColor="border-brown-500"
                borderWidth="border"
              />
              <p className="font-causten-medium text-sm text-center">
                By continuing you agree to Rolling’s{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
              <div className="mt-5">
                <p className="font-causten-medium text-lg text-center">
                  Already have an account?{" "}
                  <a href="#" className="underline">
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:basis-3/5 lg:block relative">
          <div className="w-full h-full">
            <Image
              src={BrownHoodie}
              alt="BrownHoodie"
              fill={true}
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
