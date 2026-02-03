"use client";
import HomePage from "@/components/HomePage";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state: any) => state.user);
  return (
    <main>
      <HomePage />
    </main>
  );
}
