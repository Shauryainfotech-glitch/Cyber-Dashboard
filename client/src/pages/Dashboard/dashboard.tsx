import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import MetricsCards from "@/components/metrics-cards";
import CrimeHeatmap from "@/components/crime-heatmap";
import RecentActivity from "@/components/recent-activity";
import AIAnalysisPanel from "@/components/ai-analysis-panel";
import ThreatIntelligence from "@/components/threat-intelligence";
import ActiveCasesTable from "@/components/active-cases-table";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        // Public access - no login required
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="Investigation Dashboard"
          subtitle="Real-time cyber crime monitoring and management"
        />
        
        <main className="p-6">
          {/* Key Metrics */}
          <MetricsCards />

          {/* Crime Heatmap and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <CrimeHeatmap />
            </div>
            <RecentActivity />
          </div>

          {/* AI Analysis and Threat Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AIAnalysisPanel />
            <ThreatIntelligence />
          </div>

          {/* Active Cases Table */}
          <ActiveCasesTable />
        </main>
      </div>
    </div>
  );
}
