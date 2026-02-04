import { Open_Sans, Orbitron } from "next/font/google";

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
