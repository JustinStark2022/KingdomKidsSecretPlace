import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { Home, BookOpen, Activity, User } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();

  // Hide navigation on login and signup routes
  if (location === "/login" || location === "/signup") {
    return null;
  }

  const links = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/dashboard", label: "Dashboard", icon: <Activity className="h-5 w-5" /> },
    { href: "/bible", label: "Bible", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/settings", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card shadow-md z-30 border-t">
      <div className="flex justify-around items-center py-2">
        {links.map((link) => (
          <div
            key={link.href}
            className={cn(
              "flex flex-col items-center p-2 cursor-pointer",
              location === link.href ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => (window.location.href = link.href)}
          >
            {link.icon}
            <span className="text-xs mt-1">{link.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
