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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Image, Video, Folder, Plus } from "lucide-react";
import type { Evidence, Case } from "@shared/schema";

export default function EvidenceAnalysis() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    type: "",
  });

  // Removed authentication check - system is now public

  const { data: cases } = useQuery({
    queryKey: ["/api/cases"],
  });

  const { data: evidence, isLoading: evidenceLoading } = useQuery({
    queryKey: [`/api/cases/${selectedCaseId}/evidence`],
    enabled: !!selectedCaseId,
  });

  const uploadEvidenceMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/evidence", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cases/${selectedCaseId}/evidence`] });
      setIsUploadDialogOpen(false);
      setUploadData({ title: "", description: "", type: "" });
      toast({
        title: "Success",
        description: "Evidence uploaded successfully",
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
        description: "Failed to upload evidence",
        variant: "destructive",
      });
    },
  });

  // Blockchain Evidence Storage
  const storeOnBlockchain = useMutation({
    mutationFn: async ({ evidenceId, caseId }: { evidenceId: number; caseId: number }) => {
      return apiRequest("/api/blockchain/evidence", "POST", {
        evidenceId,
        caseId,
        metadata: { timestamp: new Date(), action: "evidence_secured" }
      });
    },
    onSuccess: () => {
      toast({
        title: "Blockchain Security",
        description: "Evidence secured on blockchain with immutable hash",
      });
    },
  });

  // Advanced Evidence Analysis
  const analyzeEvidence = useMutation({
    mutationFn: async (evidenceData: any) => {
      return apiRequest("/api/analysis/digital-evidence", "POST", evidenceData);
    },
    onSuccess: () => {
      toast({
        title: "AI Analysis Complete",
        description: "Advanced digital evidence analysis completed",
      });
    },
  });

  // ML Sentiment Analysis
  const runMLAnalysis = useMutation({
    mutationFn: async (textData: any) => {
      return apiRequest("/api/ml/analyze-sentiment", "POST", { textData });
    },
    onSuccess: () => {
      toast({
        title: "ML Analysis",
        description: "Machine learning sentiment analysis completed",
      });
    },
  });

  // Quantum Security Verification
  const verifyQuantumSecurity = useMutation({
    mutationFn: async (evidenceId: number) => {
      return apiRequest("/api/security/quantum/verify", "POST", { evidenceId });
    },
    onSuccess: () => {
      toast({
        title: "Quantum Verification",
        description: "Evidence verified with quantum-resistant security",
      });
    },
  });

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("caseId", selectedCaseId);
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("type", uploadData.type);
    
    uploadEvidenceMutation.mutate(formData);
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-5 w-5 text-blue-500" />;
      case "video": return <Video className="h-5 w-5 text-purple-500" />;
      case "document": return <FileText className="h-5 w-5 text-green-500" />;
      default: return <Folder className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // System is now public - no authentication required

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="Evidence Analysis"
          subtitle="Manage and analyze digital evidence"
        />
        
        <main className="p-6">
          {/* Case Selection and Upload */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="min-w-0">
                <label className="text-sm font-medium mb-2 block">Select Case</label>
                <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Choose a case" />
                  </SelectTrigger>
                  <SelectContent>
                    {(cases as Case[] || []).map((caseItem: Case) => (
                      <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                        {caseItem.caseNumber} - {caseItem.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedCaseId && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="law-enforcement-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Evidence
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Evidence</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input
                        value={uploadData.title}
                        onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={uploadData.description}
                        onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Evidence Type</label>
                      <Select value={uploadData.type} onValueChange={(value) => setUploadData({ ...uploadData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="digital">Digital Evidence</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">File</label>
                      <Input type="file" name="file" required />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        disabled={uploadEvidenceMutation.isPending}
                        className="flex-1 law-enforcement-primary"
                      >
                        {uploadEvidenceMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Evidence List */}
          {!selectedCaseId ? (
            <Card>
              <CardContent className="text-center py-12">
                <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a case to view evidence</p>
              </CardContent>
            </Card>
          ) : evidenceLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading evidence...</p>
            </div>
          ) : !evidence || (evidence as Evidence[] || []).length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No evidence found for this case</p>
                <p className="text-sm text-gray-400 mt-2">
                  Upload evidence files to begin analysis
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(evidence as Evidence[] || []).map((item: Evidence) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getEvidenceIcon(item.type)}
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      {item.fileSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Size:</span>
                          <span>{formatFileSize(item.fileSize)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Uploaded:</span>
                        <span>{item.createdAt ? new Date(item.createdAt as string).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      {item.hash && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hash:</span>
                          <span className="font-mono text-xs truncate">{item.hash.slice(0, 16)}...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 mt-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => analyzeEvidence.mutate({ 
                            evidenceId: item.id, 
                            description: item.description, 
                            type: item.type 
                          })}
                          disabled={analyzeEvidence.isPending}
                        >
                          {analyzeEvidence.isPending ? 'Analyzing...' : 'AI Analyze'}
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="flex-1 text-xs"
                          onClick={() => storeOnBlockchain.mutate({ 
                            evidenceId: item.id, 
                            caseId: parseInt(selectedCaseId) 
                          })}
                          disabled={storeOnBlockchain.isPending}
                        >
                          {storeOnBlockchain.isPending ? '🔒' : '🔗 Blockchain'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="flex-1 text-xs"
                          onClick={() => runMLAnalysis.mutate({ 
                            text: item.description, 
                            evidenceType: item.type 
                          })}
                          disabled={runMLAnalysis.isPending}
                        >
                          {runMLAnalysis.isPending ? '🧠' : '🤖 ML'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="flex-1 text-xs"
                          onClick={() => verifyQuantumSecurity.mutate(item.id)}
                          disabled={verifyQuantumSecurity.isPending}
                        >
                          {verifyQuantumSecurity.isPending ? '🔐' : '🛡️ Quantum'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Evidence Analysis Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center">
              <CardHeader>
                <Image className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Image Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Advanced image forensics and metadata extraction
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Document Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  OCR, text extraction, and document authenticity verification
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Video className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Media Forensics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Video analysis, deepfake detection, and timeline reconstruction
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
