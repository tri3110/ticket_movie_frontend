import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';
import GuestTemplate from "./page";

export const metadata: Metadata = {
  title: "Watch",
  description: "Watch",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <GuestTemplate>{children}</GuestTemplate>
  );
}
