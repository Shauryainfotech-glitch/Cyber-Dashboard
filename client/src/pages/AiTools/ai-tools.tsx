import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Search, FileText, Shield, AlertTriangle, TrendingUp, Phone, Globe, Eye, BarChart3, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { t, Language } from "@/lib/translations";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import SOPReference from "@/components/sop-reference";

export default function AITools() {
  const [analysisText, setAnalysisText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!analysisText.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis with SOP-based categorization
    setTimeout(() => {
      setAnalysisResult({
        category: "financial_fraud",
        subType: "online_banking_fraud",
        confidence: 0.87,
        priority: "high",
        sopSection: "Financial Fraud - Generic Cybercrime SOP Section 3.5",
        legalProvisions: ["ITA Sec 66C", "ITA Sec 66D", "IPC 420"],
        investigationSteps: [
          "Preliminary Investigation - Collect bank statements",
          "Crime Scene Investigation - Secure transaction logs",
          "Cyber Forensics - Trace IP addresses and devices",
          "Final Report - Document evidence chain"
        ],
        keywords: ["banking", "transfer", "fraud", "account", "UPI"],
        recommendations: [
          "Immediate account verification required",
          "Contact bank security team within 24 hours",
          "Preserve all transaction logs and communications",
          "Document victim statements following SOP guidelines",
          "Initiate IP address tracing through technical team"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="AI Analysis Tools & SOP Reference"
          subtitle="AI-powered cybercrime investigation with Standard Operating Procedures"
        />
        
        <main className="p-6">
          <Tabs defaultValue="ai-analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-analysis">AI Analysis Tools</TabsTrigger>
              <TabsTrigger value="sop-reference">SOP Reference Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-analysis" className="space-y-6">
              {/* AI Complaint Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    SOP-Based Complaint Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter complaint text for AI analysis (follows Indian Cybercrime SOP guidelines)
                    </label>
                    <Textarea
                      value={analysisText}
                      onChange={(e) => setAnalysisText(e.target.value)}
                      placeholder="Paste the complaint description here..."
                      className="min-h-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!analysisText.trim() || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Complaint (AI + SOP)"}
                  </Button>

                  {analysisResult && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-3">SOP-Based Analysis Results</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Crime Category:</span>
                          <Badge className="ml-2">{analysisResult.category.replace('_', ' ')}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Sub-type:</span>
                          <Badge variant="outline" className="ml-2">{analysisResult.subType.replace('_', ' ')}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <Badge variant="outline" className="ml-2">
                            {(analysisResult.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Priority Level:</span>
                          <Badge 
                            className={`ml-2 ${
                              analysisResult.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              analysisResult.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}
                          >
                            {analysisResult.priority}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">SOP Section:</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {analysisResult.sopSection}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Legal Provisions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysisResult.legalProvisions.map((provision, idx) => (
                            <Badge key={idx} className="bg-red-100 text-red-800 text-xs">
                              {provision}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Investigation Steps (SOP-Based):</span>
                        <ol className="mt-1 text-sm space-y-1">
                          {analysisResult.investigationSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                                {idx + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Keywords Identified:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysisResult.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-600">Immediate Action Items:</span>
                        <ul className="mt-1 text-sm space-y-1">
                          {analysisResult.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other AI Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Search className="h-5 w-5 mr-2 text-primary" />
                      Pattern Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Identify patterns across cases using SOP-based categorization and AI algorithms.
                    </p>
                    <Button variant="outline" className="w-full">
                      Launch Tool
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      SOP Report Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Generate investigation reports following Indian cybercrime SOP guidelines.
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      Threat Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Monitor emerging cybercrime threats with AI-powered analysis.
                    </p>
                    <Button variant="outline" className="w-full">
                      Analyze Threats
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Evaluate cybercrime risk levels using SOP-based assessment criteria.
                    </p>
                    <Button variant="outline" className="w-full">
                      Assess Risk
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                      Predictive Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">
                      Predict cybercrime trends and hotspots using historical data analysis.
                    </p>
                    <Button variant="outline" className="w-full">
                      View Predictions
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-500">
                      More AI Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      Additional SOP-integrated AI tools are in development.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sop-reference">
              <SOPReference />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}