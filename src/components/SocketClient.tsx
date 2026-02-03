"use client";
import { useEffect } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/lib/store/userSlice";

let socket: any;

export default function SocketClient() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (!socket) {
      socket = io(
        "https://premium-capital-realtime-server-production.up.railway.app/",
        {
          transports: ["websocket"],
        }
      );
    }

    if (user?._id) {
      socket.emit("register-user", user._id);
    }

    socket.on("user-updated", (updatedUser: any) => {
      console.log("🔥 User data changed:", updatedUser);
      dispatch(setUser(updatedUser));
    });

    return () => {
      if (socket) socket.off("user-updated");
    };
  }, [user?._id]);

  return null;
}
