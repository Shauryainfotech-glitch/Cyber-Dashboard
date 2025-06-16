import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  LayoutDashboard, 
  FolderOpen, 
  Bot, 
  Search, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  MessageSquare,
  Plus,
  Upload,
  Settings,
  Lock
} from "lucide-react";
import { t, Language } from "@/lib/translations";

// Get current language from localStorage
const getCurrentLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem("ccms-language") as Language) || "en";
  }
  return "en";
};

const getNavigation = () => {
  const lang = getCurrentLanguage();
  return [
    { name: t("dashboard", lang), href: "/", icon: LayoutDashboard },
    { name: t("caseManagement", lang), href: "/case-management", icon: FolderOpen },
    { name: t("aiTools", lang), href: "/ai-tools", icon: Bot },
    { name: t("evidenceAnalysis", lang), href: "/evidence-analysis", icon: Search },
    { name: t("victimSupport", lang), href: "/victim-support", icon: Users },
  ];
};

const getAdminNavigation = () => {
  const lang = getCurrentLanguage();
  return [
    { name: t("securitySettings", lang), href: "/security-settings", icon: Lock },
    { name: t("masterConfig", lang), href: "/master-config", icon: Settings },
    { name: lang === 'mr' ? 'सिस्टम मॉनिटरिंग' : 'System Monitoring', href: "/system-monitoring", icon: BarChart3 },
  ];
};

const quickActions = [
  { name: "New Case", href: "/cases", icon: Plus },
  { name: "Upload Evidence", href: "/evidence", icon: Upload },
];

export default function Sidebar() {
  const [location] = useLocation();
  const lang = getCurrentLanguage();
  const navigation = getNavigation();
  const adminNavigation = getAdminNavigation();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 px-4 law-enforcement-primary">
          <div className="flex items-center space-x-2">
            <Shield className="text-white text-2xl h-8 w-8" />
            <div className="text-white">
              <div className="font-bold text-sm">{t("appName", lang).split(' ')[0]}</div>
              <div className="text-xs opacity-90">{t("location", lang)}</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href || 
                (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "sidebar-active text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {lang === 'mr' ? 'प्रशासन' : 'Administration'}
            </h3>
            <div className="mt-2 space-y-1">
              {adminNavigation.map((item) => {
                const isActive = location === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                        isActive
                          ? "sidebar-active text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="mt-2 space-y-1">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <action.icon className="w-5 h-5 mr-3" />
                    {action.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 law-enforcement-primary rounded-full flex items-center justify-center">
              <Shield className="text-white text-sm h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Inspector Kumar</p>
              <p className="text-xs text-gray-500">Senior Investigation Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
