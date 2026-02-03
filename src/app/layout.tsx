import { GlobalStyle } from "@/styles/GlobalStyle";
import type { Metadata } from "next";
import { openSans } from "./fonts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/providers/ReduxProvider";
import ClientSyncUser from "@/components/ClientSyncUser";
import { getCurrentUserFull } from "@/lib/auth";
import SocketClient from "@/components/SocketClient";
import Script from "next/script";
import Smartsupp from "@/components/Smartsupp";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  icons: {
    icon: "/images/logo.png",
  },
  title: "Premium Pay Exchange",
  description:
    "Premium Pay Exchange is a true opportunity to earn on cryptocurrency/binary. Premium Pay Exchange is a company formed by a team of PROFESSIONAL TRADERS with EXPERTISE in one of the biggest financial markets of today, the CRYPTOCURRENCY/BINARY. Our focus is to provide our affiliates with daily and constant profits in these markets.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserFull();
  // const plainUser = user ? JSON.parse(JSON.stringify(user)) : undefined;
  const plainUser =
    user === null
      ? null
      : user === undefined
        ? undefined
        : JSON.parse(JSON.stringify(user));

  return (
    <html lang="en">
      <body className={openSans.variable}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <ReduxProvider>
            <ClientSyncUser user={plainUser} />
            <SocketClient />
            {children}
          </ReduxProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#111",
                color: "#fff",
                border: "1px solid #f7931a",
              },
            }}
          />
          <Smartsupp />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
