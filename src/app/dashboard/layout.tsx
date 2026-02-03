import React from "react";
import { getCurrentUserFull } from "@/lib/auth";
import ClientSyncUser from "@/components/ClientSyncUser";
import DashboardLayoutUI from "@/components/DashboardLayoutUI";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🟦 SERVER: Read cookie → decode JWT → fetch user from DB
  const user = await getCurrentUserFull();

  // 🟩 Ensure user object is serializable for the client
  // const plainUser = user ? JSON.parse(JSON.stringify(user)) : null;

  const plainUser =
    user === null
      ? null
      : user === undefined
      ? undefined
      : JSON.parse(JSON.stringify(user));

  return (
    <>
      {/* Sync user to Redux / client store */}
      <ClientSyncUser user={plainUser} />

      {/* Layout wrapper */}
      <DashboardLayoutUI>{children}</DashboardLayoutUI>
    </>
  );
}
