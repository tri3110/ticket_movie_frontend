import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/app.footer';
import HeaderApp from '@/components/app.header';
import 'flag-icons/css/flag-icons.min.css';
import { ProviderContextApp } from "@/context/app.context";
import { SessionProvider } from "next-auth/react";
import I18nProvider from "@/context/i18n-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <SessionProvider>
          <ProviderContextApp>
            <I18nProvider>
              <HeaderApp/>
              {children}
              <Footer />
            </I18nProvider>
          </ProviderContextApp>
        </SessionProvider>
        
      </body>
    </html>
  );
}
