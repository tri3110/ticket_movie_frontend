import type { Metadata } from "next";
import 'flag-icons/css/flag-icons.min.css';
import AdminTemplate from "./page";
import { SidebarProvider } from "@/context/sidebar.context";

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
    <AdminTemplate>{children}</AdminTemplate>
  );
}
