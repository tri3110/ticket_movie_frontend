import type { Metadata } from "next";
import 'flag-icons/css/flag-icons.min.css';
import GuestTemplate from "./guest.layout";

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
