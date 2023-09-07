"use client";

import store from "../utils/store";
import { Provider } from "react-redux";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}
