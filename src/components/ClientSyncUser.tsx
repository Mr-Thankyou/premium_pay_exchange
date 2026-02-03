"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store/userSlice";

export default function ClientSyncUser({ user }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // if (user) {
    //   dispatch(setUser(user));
    // }
    dispatch(setUser(user));
  }, [user, dispatch]);

  return null;
}
