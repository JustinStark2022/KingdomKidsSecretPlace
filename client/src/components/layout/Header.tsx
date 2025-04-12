import React from "react";
import Logo from "../ui/logo";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onNotificationsClick }) => {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Get unread notifications count
  const { data: notifications } = useQuery<{ count: number }>({
    queryKey: ['/api/notifications/unread'],
    enabled: location !== '/login' && location !== '/signup',
  });
  
  const unreadCount = notifications?.count || 0;
  
  // Don't show header on login/signup pages
  if (location === '/login' || location === '/signup') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-card shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5 text-primary" />
            </Button>
          )}
          
          <Logo />
        </div>
        
        <div className="flex items-center space-x-4">
          {!isMobile && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 pr-4 py-2 bg-muted"
                placeholder="Search..."
                type="search"
              />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={onNotificationsClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
            {!isMobile && (
              <Label htmlFor="theme-toggle" className="text-sm">
                Dark Mode
              </Label>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
