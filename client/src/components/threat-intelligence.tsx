import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { ThreatIntelligence } from "@shared/schema";

export default function ThreatIntelligence() {
  const { data: threats, isLoading } = useQuery({
    queryKey: ["/api/threats"],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500 bg-red-50";
      case "high": return "border-orange-500 bg-orange-50";
      case "medium": return "border-blue-500 bg-blue-50";
      case "low": return "border-green-500 bg-green-50";
      default: return "border-gray-500 bg-gray-50";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Threat Intelligence Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-4 py-2 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock threat data if no real data is available
  const mockThreats = [
    {
      id: 1,
      title: "Ransomware Campaign Detected",
      description: "Targeting financial institutions in Maharashtra region",
      severity: "critical",
      category: "ransomware",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: 2,
      title: "Phishing Spike Detected",
      description: "Increase in banking phishing attempts by 340%",
      severity: "high",
      category: "phishing",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    },
    {
      id: 3,
      title: "New Malware Variant",
      description: "Android banking trojan spreading via SMS",
      severity: "medium",
      category: "malware",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    }
  ];

  const displayThreats = threats && threats.length > 0 ? threats : mockThreats;

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Threat Intelligence Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayThreats.map((threat: any) => (
            <div 
              key={threat.id} 
              className={`border-l-4 pl-4 py-2 ${getSeverityColor(threat.severity)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{threat.title}</span>
                <Badge className={getSeverityBadge(threat.severity)}>
                  {threat.severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">{threat.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(threat.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
        
        {/* Threat Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-red-600">
                {displayThreats.filter((t: any) => t.severity === "critical").length}
              </p>
              <p className="text-xs text-gray-600">Critical Threats</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">
                {displayThreats.filter((t: any) => t.severity === "high").length}
              </p>
              <p className="text-xs text-gray-600">High Priority</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
