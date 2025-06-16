import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

export default function AIAnalysisPanel() {
  // Mock data for AI analysis progress
  const analysisJobs = [
    {
      id: 1,
      name: "Pattern Recognition",
      progress: 94,
      status: "active",
      description: "Analyzing 1,247 cases for similar patterns",
      color: "bg-green-500"
    },
    {
      id: 2,
      name: "Threat Assessment", 
      progress: 67,
      status: "processing",
      description: "Real-time threat level evaluation",
      color: "bg-yellow-500"
    },
    {
      id: 3,
      name: "Predictive Analysis",
      progress: 23,
      status: "scheduled",
      description: "Next batch processing in 2 hours",
      color: "bg-blue-500"
    }
  ];

  const getStatusBadge = (status: string, progress: number) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">{progress}% Complete</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            AI Analysis Dashboard
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            <Bot className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {analysisJobs.map((job) => (
            <div key={job.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{job.name}</span>
                {getStatusBadge(job.status, job.progress)}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`${job.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
        
        {/* AI Capabilities Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
              <p className="text-xs text-gray-600">Cases Analyzed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">94.2%</p>
              <p className="text-xs text-gray-600">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-xs text-gray-600">Patterns Found</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
