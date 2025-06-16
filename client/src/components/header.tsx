import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, AlertTriangle, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { t, Language } from "@/lib/translations";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem("ccms-language") as Language) || "en";
    }
    return "en";
  });
  const [notifications] = useState(3);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem("ccms-language", newLang);
    }
    // Force reload to apply language changes throughout the app
    window.location.reload();
  };

  const handleEmergencyAlert = () => {
    const confirmMsg = language === 'mr' ? 
      "तुम्हाला खरोखर आपत्कालीन अलर्ट ट्रिगर करायचा आहे?" : 
      "Are you sure you want to trigger an emergency alert?";
    const alertMsg = language === 'mr' ?
      "आपत्कालीन अलर्ट सिस्टम सक्रिय केला. सर्व अधिकाऱ्यांना सूचित केले आहे." :
      "Emergency alert system activated. All officers have been notified.";
      
    if (confirm(confirmMsg)) {
      alert(alertMsg);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <Select value={language} onValueChange={(value) => handleLanguageChange(value as Language)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => alert("Notification system would show real-time alerts and updates")}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
            
            {/* Emergency Button */}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleEmergencyAlert}
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {language === 'mr' ? 'आपत्कालीन अलर्ट' : 'Emergency Alert'}
            </Button>
            
            {/* Public Access - No logout needed */}
          </div>
        </div>
      </div>
    </header>
  );
}
