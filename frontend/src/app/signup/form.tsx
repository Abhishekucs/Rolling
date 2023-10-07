"use client";
import LongButton from "@/components/long-button";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { signUp } from "@/redux/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

// TODO: Refactor this component

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
  terms: boolean;
}

export default function SignupForm(): JSX.Element {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      terms: false,
    },
  });

  const { errors } = formState;
  const dispatch = useAppDispatch();
  const { loading, errorMessage, user } = useAppSelector((state) => state.Auth);
  const router = useRouter();

  async function onSubmit(data: FormValues): Promise<void> {
    await dispatch(
      signUp({
        name: data.username,
        email: data.email,
        password: data.password,
      }),
    );
  }

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <>
      {loading === "idle" ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 group w-full relative z-0">
            <label
              htmlFor="username"
              className="block mb-2 text-base font-causten-bold text-brown-500"
            >
              Name
            </label>
            <input
              type="text"
              {...register("username", {
                required: {
                  value: true,
                  message: "Name Required",
                },
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "Invalid Name",
                },
              })}
              className=" bg-transparent border border-brown-500/30 text-brown-500 text-base rounded-lg focus:ring-brown-500 focus:border-brown-500 block w-full p-2.5   "
              placeholder=""
            ></input>
            {errors.username && (
              <span className="font-causten-medium text-sm text-red-700">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="mb-6 group w-full relative z-0">
            <label
              htmlFor="email"
              className="block mb-2 text-base font-causten-bold text-brown-500"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email Required",
                },
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid Email Address",
                },
              })}
              className=" bg-transparent border border-brown-500/30 text-brown-500 text-base rounded-lg focus:ring-brown-500 focus:border-brown-500 block w-full p-2.5   "
              placeholder=""
            ></input>
            {errors.email && (
              <span className="font-causten-medium text-sm text-red-700">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mb-6 group w-full relative z-0">
            <label
              htmlFor="password"
              className="block mb-2 text-base font-causten-bold text-brown-500"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password Required",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Invalid Password",
                },
                minLength: {
                  value: 8,
                  message: "Password should have minimum 8 characters",
                },
              })}
              className=" bg-transparent border border-brown-500/30 text-brown-500 text-base rounded-lg focus:ring-brown-500 focus:border-brown-500 block w-full p-2.5   "
              placeholder=""
            ></input>
            {errors.password && (
              <span className="font-causten-medium text-sm text-red-700">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="mb-6 group w-full relative z-0">
            <label
              htmlFor="confirmpassword"
              className="block mb-2 text-base font-causten-bold text-brown-500"
            >
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmpassword", {
                required: {
                  value: true,
                  message: "Confirm Password Required",
                },
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              className=" bg-transparent border border-brown-500/30 text-brown-500 text-base rounded-lg focus:ring-brown-500 focus:border-brown-500 block w-full p-2.5   "
              placeholder=""
            ></input>
            {errors.confirmpassword && (
              <span className="font-causten-medium text-sm text-red-700">
                {errors.confirmpassword.message}
              </span>
            )}
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register("terms", {
                  required: true,
                })}
                className="w-4 h-4 border border-brown-500/30 rounded text-brown-500 bg-brown-100 focus:ring-2 focus:ring-brown-500 focus:ring-offset-brown-100 "
              />
            </div>
            <label
              htmlFor="terms"
              className="ml-2 text-sm font-causten-medium text-brown-500"
            >
              I agree with Rolling&aposs{" "}
              <Link href="#" className="text-brown-500 underline">
                Terms of Service
              </Link>
              , and{" "}
              <Link href="#" className="text-brown-500 underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          <LongButton
            text="Create Account"
            type="primary"
            buttonType="submit"
            width="full"
          />
        </form>
      ) : loading === "failed" ? (
        <div>{errorMessage}</div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
