import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { ActivityLog } from "@shared/schema";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/dashboard/activity"],
  });

  const getActivityColor = (action: string) => {
    switch (action) {
      case "create_case": return "bg-blue-500";
      case "update_case": return "bg-yellow-500";
      case "upload_evidence": return "bg-green-500";
      case "create_threat": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getActivityText = (activity: ActivityLog) => {
    switch (activity.action) {
      case "create_case":
        return `New case created: ${activity.details?.title || 'Untitled'}`;
      case "update_case":
        return `Case updated: ${activity.entityId}`;
      case "upload_evidence":
        return `Evidence uploaded for case ${activity.details?.caseId}`;
      case "create_threat":
        return `New threat detected: ${activity.details?.title || 'Unknown'}`;
      default:
        return `Activity: ${activity.action}`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity: ActivityLog) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div 
                  className={`flex-shrink-0 w-2 h-2 ${getActivityColor(activity.action)} rounded-full mt-2`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
