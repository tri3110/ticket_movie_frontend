'use client'

import { SidebarProvider, useSidebar } from '@/context/sidebar.context';
import 'flag-icons/css/flag-icons.min.css';
import AdminLayout from './admin.layout';
import { SessionProvider } from 'next-auth/react';
import { ProviderContextApp } from '@/context/app.context';
import I18nProvider from '@/context/i18n-provider';

export default function AdminTemplate({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <SessionProvider>
      <ProviderContextApp>
        <I18nProvider>
          <SidebarProvider>
            <AdminLayout>{children}</AdminLayout>
          </SidebarProvider>
        </I18nProvider>
      </ProviderContextApp>
    </SessionProvider>
  );
}