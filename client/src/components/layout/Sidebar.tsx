import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { X } from "lucide-react";
import Logo from "@/components/ui/logo";
import {
  Home,
  Shield,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Settings,
  HelpCircle,
  Activity,
  Calendar,
  Info
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/dashboard", label: "Dashboard", icon: <Activity className="h-5 w-5" /> },
    { href: "/bible", label: "Bible Reader", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/prayer", label: "Prayer Journal", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/devotionals", label: "Devotionals", icon: <Calendar className="h-5 w-5" /> },
    { href: "/lessons", label: "Bible Lessons", icon: <GraduationCap className="h-5 w-5" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/about", label: "About Us", icon: <Info className="h-5 w-5" /> },
    { href: "/support", label: "Support", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const mobileSidebar = (
    <div
      className={cn(
        "fixed inset-0 z-50 transform transition-transform duration-300 md:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-64 bg-sidebar shadow-lg">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Logo size="small" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded-lg cursor-pointer",
                      location === link.href
                        ? "bg-sidebar-accent text-primary"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                    onClick={onClose}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  const desktopSidebar = (
    <aside className="hidden md:block fixed top-15  left-0 h-screen w-[198px] bg-sidebar z-40">
      <nav className="p-1 ">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <React.Fragment key={link.href}>
              {index === 7 && (
                <li className="pt-4 pr-0 border-t border-sidebar-border mt-4" />
              )}
              <li>
                <Link href={link.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 p-2 mr-0  rounded-lg cursor-pointer",
                      location === link.href
                        ? "bg-sidebar-accent text-primary"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </Link>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </aside>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
};

export default Sidebar;

