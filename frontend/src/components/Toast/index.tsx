"use client";
import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IToast } from "@/redux/slices/toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Check2, Close } from "../icons";
import { removeToast } from "@/redux/actions/toast";

export const Toast = (props: IToast & { index: number }): JSX.Element => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.toast);
  const { error, message, createdAt, index } = props;
  return (
    <motion.li
      initial={{ translateY: "100%", opacity: 0 }}
      animate={{ translateY: `-${10 * (toasts.length - index)}px`, opacity: 1 }}
      exit={{ opacity: 0 }}
      className={` z-[9999999] bg-brown-100 py-2 px-4 rounded-md shadow-lg border border-light mt-2 font-semibold text-sm flex items-center fixed max-w-[350px] w-full bottom-4 right-4 space-x-4`}
    >
      <span className="flex-shrink-0">
        {error ? (
          <Close opacity={1} className="w-3 h-3 text-red" />
        ) : (
          <Check2 className="w-4 h-4 text-green" />
        )}
      </span>
      <span className="flex-grow">{message}</span>
      <button
        className="ml-auto flex-shrink-0"
        onClick={(): { payload: number; type: string } =>
          dispatch(removeToast(createdAt as number))
        }
      >
        <Close className="w-3 h-3" opacity={0.2} />
      </button>
    </motion.li>
  );
};

export default function Toasts(): JSX.Element {
  const toasts = useAppSelector((state) => state.toast);

  if (typeof window === "object") {
    return createPortal(
      <ul className="list-none p-0 m-0">
        <AnimatePresence>
          {toasts.map((toast: IToast, index: number) => (
            <Toast key={toast.createdAt} {...toast} index={index} />
          ))}
        </AnimatePresence>
      </ul>,
      document.body,
    );
  }

  return <ul className="list-none p-0 m-0"></ul>;
}
