import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, AlertTriangle, Bot } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CCMS</h1>
                  <p className="text-sm text-gray-600">Cyber Crime Management System</p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="law-enforcement-primary"
              >
                Officer Login
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full space-y-8 text-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                AI-Enabled Cyber Crime Management
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Advanced digital law enforcement platform for Ahilyanagar Police Department
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">Case Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Digital FIR registration and comprehensive case tracking system
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Bot className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">AI Investigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Advanced AI tools for pattern recognition and threat analysis
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <AlertTriangle className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">Threat Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Real-time monitoring and predictive threat assessment
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mx-auto" />
                  <CardTitle className="text-lg">Victim Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Comprehensive victim assistance and case status tracking
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Public Complaint Section */}
            <Card className="max-w-2xl mx-auto mt-12">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">File a Cyber Crime Complaint</CardTitle>
                <p className="text-gray-600">
                  Report cyber crimes online for immediate investigation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Online Fraud</h4>
                    <p className="text-sm text-blue-700 mt-1">Banking, shopping, investment scams</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">Cyber Harassment</h4>
                    <p className="text-sm text-red-700 mt-1">Social media, stalking, threats</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Identity Theft</h4>
                    <p className="text-sm text-green-700 mt-1">Data breach, impersonation</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full law-enforcement-primary"
                  onClick={() => window.open('#complaint-form', '_self')}
                >
                  File Complaint Online
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Available in English, Hindi, and Marathi
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Ahilyanagar Police Department - Cyber Crime Management System</p>
              <p className="text-sm mt-2">
                For emergencies, call 100 | Cyber Crime Helpline: 1930
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
