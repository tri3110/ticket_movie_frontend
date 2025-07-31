'use client'

import { ProviderContextApp } from "@/context/app.context";
import I18nProvider from "@/context/i18n-provider";
import { SessionProvider } from "next-auth/react";
import HeaderApp from '@/components/guest/app.header';
import Footer from '@/components/guest/app.footer';

export default function GuestTemplate({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <SessionProvider>
        <ProviderContextApp>
          <I18nProvider>
            <HeaderApp/>
            {children}
            <Footer />
          </I18nProvider>
        </ProviderContextApp>
      </SessionProvider>
    </>
  );
}