import { setOnlineStatus } from "@/redux/actions/connection-action";
import { Dispatch } from "@reduxjs/toolkit";
import store from "@/utils/store";

export function connectionListener(dispatch: Dispatch) {
  const handleOnlineStatusChange = () => {
    dispatch(setOnlineStatus(navigator.onLine));
  };

  window.addEventListener("online", handleOnlineStatusChange);
  window.addEventListener("offline", handleOnlineStatusChange);

  return () => {
    window.removeEventListener("online", handleOnlineStatusChange);
    window.removeEventListener("offline", handleOnlineStatusChange);
  };
}

export function getInternetStatus(): boolean {
  const data = store.getState().connection.isOnline;
  if (data == null || !data) {
    return false;
  }
  return true;
}
