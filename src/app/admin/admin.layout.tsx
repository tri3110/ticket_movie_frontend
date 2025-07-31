'use client'

import HeaderAdmin from '@/components/admin/admin.header';
import AppSidebar from '@/components/admin/admin.sidebar';
import Backdrop from '@/components/admin/Backdrop';
import { SidebarProvider, useSidebar } from '@/context/sidebar.context';
import 'flag-icons/css/flag-icons.min.css';

export default function AdminLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
  
  return (
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div
          className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          <HeaderAdmin />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </div>
      </div>
  );
}