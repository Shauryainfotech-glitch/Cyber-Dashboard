import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Eye, Edit, Calendar, User, MapPin, Upload } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import CaseForm from "@/components/case-form";
import { Case } from "@shared/schema";

export default function CaseManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: cases, isLoading, error } = useQuery({
    queryKey: ["/api/cases"],
    retry: false,
  });

  const createCaseMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/cases", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Case created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create case",
        variant: "destructive",
      });
    },
  });

  const handleCreateCase = (data: any) => {
    createCaseMutation.mutate(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-purple-100 text-purple-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <Sidebar />
        <div className="pl-64">
          <Header 
            title="Case Management"
            subtitle="Manage and track cyber crime cases"
          />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cases...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && isUnauthorizedError(error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      // Public access - no login required
    }, 500);
    return null;
  }

  const filteredCases = cases?.filter((caseItem: Case) =>
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseItem.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="Case Management"
          subtitle="Manage and track cyber crime cases"
        />
        
        <main className="p-6">
          {/* Quick Actions Panel */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-20 text-left flex-col items-start justify-center space-y-2 law-enforcement-primary">
                      <Plus className="h-6 w-6" />
                      <div>
                        <div className="font-semibold">Create New Case</div>
                        <div className="text-xs opacity-90">Register a new cybercrime incident</div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Case</DialogTitle>
                    </DialogHeader>
                    <CaseForm 
                      onSubmit={handleCreateCase}
                      isLoading={createCaseMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={() => window.location.href = '/evidence-analysis'}
                  className="h-20 text-left flex-col items-start justify-center space-y-2 bg-green-600 hover:bg-green-700"
                >
                  <Upload className="h-6 w-6" />
                  <div>
                    <div className="font-semibold">Upload Evidence</div>
                    <div className="text-xs opacity-90">Add digital evidence to cases</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="law-enforcement-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>

          {/* Cases Display */}
          {filteredCases.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "No cases found matching your search" : "No cases found"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Case
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((caseItem: Case) => (
                <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-primary">
                        {caseItem.caseNumber}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(caseItem.priority)}>
                          {caseItem.priority}
                        </Badge>
                        <Badge className={getStatusColor(caseItem.status)}>
                          {caseItem.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{caseItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {caseItem.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium">{caseItem.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                      </div>
                      {caseItem.assignedTo && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Assigned:</span>
                          <span>{caseItem.assignedTo}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}