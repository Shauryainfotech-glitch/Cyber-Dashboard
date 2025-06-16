import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, CheckCircle, AlertTriangle, Bot } from "lucide-react";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const cards = [
    {
      title: "Active Cases",
      value: metrics?.activeCases || 0,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeText: "from last month"
    },
    {
      title: "Resolved Today",
      value: metrics?.resolvedToday || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeText: "efficiency improvement"
    },
    {
      title: "High Priority",
      value: metrics?.highPriority || 0,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5",
      changeText: "new alerts"
    },
    {
      title: "AI Detections",
      value: metrics?.aiDetections || 0,
      icon: Bot,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "94.2%",
      changeText: "accuracy rate"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 ${card.bgColor} rounded-lg`}>
                <card.icon className={`${card.color} text-xl h-6 w-6`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">{card.change}</span>
              <span className="text-sm text-gray-500 ml-2">{card.changeText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
