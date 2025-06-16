import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

export default function CrimeHeatmap() {
  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Crime Heatmap - Ahilyanagar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select defaultValue="7days">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Geographic heatmap showing crime density across different areas of Ahilyanagar */}
        <div className="h-80 bg-gradient-to-br from-blue-50 to-red-50 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Interactive Crime Heatmap</p>
              <p className="text-sm text-gray-500 mt-2">Showing cyber crime density across Ahilyanagar</p>
            </div>
          </div>
          
          {/* Simulated heat spots */}
          <div className="absolute top-16 left-20 w-6 h-6 bg-red-500 bg-opacity-60 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-24 w-4 h-4 bg-orange-500 bg-opacity-60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-32 w-8 h-8 bg-red-500 bg-opacity-40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-5 h-5 bg-orange-500 bg-opacity-50 rounded-full animate-pulse"></div>
          <div className="absolute top-24 left-1/2 w-3 h-3 bg-yellow-500 bg-opacity-60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-24 w-4 h-4 bg-red-500 bg-opacity-70 rounded-full animate-pulse"></div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">High Incidents</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Medium Incidents</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Low Incidents</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
