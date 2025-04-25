import { useState, ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { 
  Home, 
  BookOpen, 
  BookMarked, 
  Gift, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Moon, 
  Sun
} from "lucide-react";

interface ChildLayoutProps {
  children: ReactNode;
  title: string;
}

export default function ChildLayout({ children, title }: ChildLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
  };
  
  // Navigation items
  const navItems = [
    { path: "/child-dashboard", label: "My Home", icon: <Home className="mr-3 h-6 w-6" /> },
    { path: "/bible", label: "Bible Adventures", icon: <BookOpen className="mr-3 h-6 w-6" /> },
    { path: "/lessons", label: "Bible Lessons", icon: <BookMarked className="mr-3 h-6 w-6" /> },
    { path: "/rewards", label: "My Rewards", icon: <Gift className="mr-3 h-6 w-6" /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens and mobile when toggled */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-50">
              <img 
                src="https://images.unsplash.com/photo-1535957998253-26ae1ef29506?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-semibold text-primary">Kingdom Kids</span>
          </div>
          <button onClick={closeSidebar} className="text-gray-500 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full scrollbar-hide py-4">
          <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-400">
                <img 
                  src="https://images.unsplash.com/photo-1546512565-39d4dc75e556?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{user?.username || "Guest"}</div>
                <div className="text-xs text-accent-500">Super Bible Explorer!</div>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a
                    className={`flex items-center px-4 py-3 text-base rounded-xl ${
                      location === item.path
                        ? "bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900/40 dark:to-primary-900/40 text-accent-600 dark:text-accent-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="px-4 mt-10">
            <Button
              className="w-full justify-center rounded-xl py-6 text-base"
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="text-gray-500 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="ml-4 lg:ml-0">
                <span className="text-xl font-semibold">{title}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
