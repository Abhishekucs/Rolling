"use client";

import { setOnlineStatus } from "@/redux/actions/connection-action";
import {
  connectionListener,
  getConnectionStatus,
} from "@/utils/connection-event";
import { useAppDispatch } from "@/utils/hooks";
import { useEffect } from "react";

export default function Banner() {
  const isOnline = getConnectionStatus();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const initialStatus = navigator.onLine;
    dispatch(setOnlineStatus(initialStatus));

    const removeListners = connectionListener(dispatch);

    return () => {
      removeListners();
    };
  }, [dispatch]);

  return (
    <div
      className={`${
        isOnline === null || isOnline ? "hidden" : "visible"
      } absolute w-full bg-brown-200 px-4 py-2 z-50`}
    >
      <div className="grid grid-cols-3">
        <div>Icon Left</div>
        <p className="flex justify-center items-center">
          No Internet Connection
        </p>
        <div className="flex justify-end">Close Button</div>
      </div>
    </div>
  );
}
