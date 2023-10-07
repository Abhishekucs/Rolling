"use client";
import { getDataAndInit } from "@/redux/actions/auth";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataAndInit());
  }, [dispatch]);

  return <>{children}</>;
}
