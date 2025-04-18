// client/src/components/layout/Layout.tsx
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import NotificationsPanel from "../alerts/NotificationsPanel";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setNotificationsOpen(!toggleNotifications);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading your experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={toggleSidebar} onNotificationsClick={toggleNotifications} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-0 pl-0 md:ml-[156px]">{children}</main>
      </div>
      <MobileNav />
      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
};

export default Layout;
