import { setOnlineStatus } from "@/redux/slices/connection-slice";
import { Dispatch } from "@reduxjs/toolkit";

export function connectionListener(dispatch: Dispatch): () => void {
  const handleOnlineStatusChange = (): void => {
    dispatch(setOnlineStatus(navigator.onLine));
  };

  window.addEventListener("online", handleOnlineStatusChange);
  window.addEventListener("offline", handleOnlineStatusChange);

  return (): void => {
    window.removeEventListener("online", handleOnlineStatusChange);
    window.removeEventListener("offline", handleOnlineStatusChange);
  };
}
