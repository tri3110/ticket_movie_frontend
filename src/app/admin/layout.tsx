import { Outfit } from 'next/font/google';
import './admin.css';

import { SidebarProvider } from '@/context/sidebar.context';
import { ThemeProvider } from '@/context/ThemeContext';
import AdminLayout from './admin.layout';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider>
          <SidebarProvider>
            <AdminLayout>{children}</AdminLayout>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}