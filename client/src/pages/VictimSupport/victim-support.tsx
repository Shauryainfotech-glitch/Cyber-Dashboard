import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Phone, Mail, MessageSquare, FileText, AlertCircle } from "lucide-react";
import type { Complaint } from "@shared/schema";

export default function VictimSupport() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Removed authentication check - system is now public

  const { data: complaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/complaints"],
  });

  const updateComplaintMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      await apiRequest("PUT", `/api/complaints/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update complaint",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-100 text-blue-800";
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "assigned": return "bg-purple-100 text-purple-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityFromCategory = (category: string) => {
    const highPriorityCategories = ["fraud", "harassment", "identity_theft"];
    return highPriorityCategories.includes(category) ? "high" : "medium";
  };

  const handleStatusUpdate = (complaintId: number, newStatus: string) => {
    updateComplaintMutation.mutate({ id: complaintId, updates: { status: newStatus } });
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailDialogOpen(true);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="Victim Support Portal"
          subtitle="Manage victim complaints and provide support services"
        />
        
        <main className="p-6">
          {/* Support Services Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Total Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints?.length || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <AlertCircle className="h-8 w-8 text-warning mx-auto" />
                <CardTitle className="text-lg">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints?.filter((c: Complaint) => c.status === "submitted").length || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-accent mx-auto" />
                <CardTitle className="text-lg">Under Investigation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints?.filter((c: Complaint) => c.status === "assigned").length || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto" />
                <CardTitle className="text-lg">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints?.filter((c: Complaint) => c.status === "resolved").length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Complaints List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              {complaintsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading complaints...</p>
                </div>
              ) : !complaints || complaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No complaints found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint: Complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-primary">
                              {complaint.complaintNumber}
                            </h3>
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                            {complaint.aiCategory && (
                              <Badge variant="outline">
                                {complaint.aiCategory}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{complaint.victimName}</p>
                              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                {complaint.victimEmail && (
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-1" />
                                    <span>{complaint.victimEmail}</span>
                                  </div>
                                )}
                                {complaint.victimPhone && (
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-1" />
                                    <span>{complaint.victimPhone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Type:</span> {complaint.incidentType}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Date:</span> {new Date(complaint.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {complaint.incidentDescription}
                          </p>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(complaint)}
                          >
                            View Details
                          </Button>
                          
                          {complaint.status === "submitted" && (
                            <Select onValueChange={(value) => handleStatusUpdate(complaint.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under_review">Under Review</SelectItem>
                                <SelectItem value="assigned">Assign Case</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Complaint Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Complaint Details - {selectedComplaint?.complaintNumber}
                </DialogTitle>
              </DialogHeader>
              
              {selectedComplaint && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Victim Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedComplaint.victimName}</p>
                        {selectedComplaint.victimEmail && (
                          <p><span className="font-medium">Email:</span> {selectedComplaint.victimEmail}</p>
                        )}
                        {selectedComplaint.victimPhone && (
                          <p><span className="font-medium">Phone:</span> {selectedComplaint.victimPhone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Incident Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> {selectedComplaint.incidentType}</p>
                        <p><span className="font-medium">Date:</span> {selectedComplaint.incidentDate ? new Date(selectedComplaint.incidentDate).toLocaleDateString() : "Not specified"}</p>
                        <p><span className="font-medium">Status:</span> 
                          <Badge className={`${getStatusColor(selectedComplaint.status)} ml-2`}>
                            {selectedComplaint.status.replace('_', ' ')}
                          </Badge>
                        </p>
                        {selectedComplaint.aiCategory && (
                          <p><span className="font-medium">AI Category:</span> 
                            <Badge variant="outline" className="ml-2">
                              {selectedComplaint.aiCategory}
                            </Badge>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded border">
                      {selectedComplaint.incidentDescription}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="law-enforcement-primary"
                      onClick={() => {
                        // Handle creating a case from complaint
                        toast({
                          title: "Feature Coming Soon",
                          description: "Case creation from complaint will be available soon",
                        });
                      }}
                    >
                      Create Case
                    </Button>
                    <Button variant="outline">
                      Contact Victim
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Support Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center">
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Helpline Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  24/7 victim support and crisis counseling
                </p>
                <p className="font-semibold text-primary">1930</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Online Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Chat support and educational resources for cyber safety
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Legal Aid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Free legal consultation and assistance for cyber crime victims
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
