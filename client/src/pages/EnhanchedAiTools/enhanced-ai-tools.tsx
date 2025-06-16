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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Brain, Search, FileText, Shield, AlertTriangle, TrendingUp, Phone, Globe, Eye, BarChart3, Zap, Bot, Target, Users, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { t, Language } from "@/lib/translations";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function EnhancedAITools() {
  const [lang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem("ccms-language") as Language) || "en";
    }
    return "en";
  });

  // Advanced Analysis States
  const [evidenceData, setEvidenceData] = useState("");
  const [caseContext, setCaseContext] = useState("");
  const [advancedResult, setAdvancedResult] = useState<any>(null);

  // Threat Intelligence States
  const [crimeType, setCrimeType] = useState("");
  const [threatIndicators, setThreatIndicators] = useState("");
  const [intelligenceResult, setIntelligenceResult] = useState<any>(null);

  // SMS Alert States
  const [alertPhone, setAlertPhone] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertPriority, setAlertPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  // Emergency Alert States
  const [incident, setIncident] = useState("");
  const [location, setLocation] = useState("");
  const [officerPhones, setOfficerPhones] = useState("");

  // Pattern Analysis States
  const [currentCase, setCurrentCase] = useState("");
  const [patternResult, setPatternResult] = useState<any>(null);

  // Advanced Analysis Mutation
  const advancedAnalysis = useMutation({
    mutationFn: async ({ evidenceData, caseContext }: { evidenceData: string; caseContext: string }) => {
      return apiRequest("/api/analysis/advanced", "POST", { evidenceData, caseContext });
    },
    onSuccess: (data) => {
      setAdvancedResult(data);
    }
  });

  // Pattern Analysis Mutation
  const patternAnalysis = useMutation({
    mutationFn: async ({ currentCase, historicalCases }: { currentCase: string; historicalCases: string[] }) => {
      return apiRequest("/api/analysis/patterns", "POST", { currentCase, historicalCases });
    },
    onSuccess: (data) => {
      setPatternResult(data);
    }
  });

  // Threat Intelligence Mutations
  const cybercrimeIntelligence = useMutation({
    mutationFn: async (type: string) => {
      return apiRequest(`/api/intelligence/cybercrime/${type}`, "GET");
    },
    onSuccess: (data) => {
      setIntelligenceResult(data);
    }
  });

  const threatAnalysis = useMutation({
    mutationFn: async (indicators: string[]) => {
      return apiRequest("/api/intelligence/threat", "POST", { indicators });
    },
    onSuccess: (data) => {
      setIntelligenceResult(data);
    }
  });

  // SMS Alert Mutation
  const smsAlert = useMutation({
    mutationFn: async ({ to, message, priority }: { to: string; message: string; priority: string }) => {
      return apiRequest("/api/alerts/sms", "POST", { to, message, priority });
    }
  });

  // Emergency Alert Mutation
  const emergencyAlert = useMutation({
    mutationFn: async ({ incident, location, officerPhones }: { incident: string; location: string; officerPhones: string[] }) => {
      return apiRequest("/api/alerts/emergency", "POST", { incident, location, officerPhones });
    }
  });

  const handleAdvancedAnalysis = () => {
    if (!evidenceData.trim() || !caseContext.trim()) return;
    advancedAnalysis.mutate({ evidenceData, caseContext });
  };

  const handlePatternAnalysis = () => {
    if (!currentCase.trim()) return;
    // For demo purposes, using empty historical cases array
    patternAnalysis.mutate({ currentCase, historicalCases: [] });
  };

  const handleThreatIntelligence = () => {
    if (!crimeType.trim()) return;
    cybercrimeIntelligence.mutate(crimeType);
  };

  const handleThreatAnalysis = () => {
    if (!threatIndicators.trim()) return;
    const indicators = threatIndicators.split('\n').filter(i => i.trim());
    threatAnalysis.mutate(indicators);
  };

  const handleSMSAlert = () => {
    if (!alertPhone.trim() || !alertMessage.trim()) return;
    smsAlert.mutate({ to: alertPhone, message: alertMessage, priority: alertPriority });
  };

  const handleEmergencyAlert = () => {
    if (!incident.trim() || !location.trim() || !officerPhones.trim()) return;
    const phones = officerPhones.split('\n').filter(p => p.trim());
    emergencyAlert.mutate({ incident, location, officerPhones: phones });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header 
          title={t("enhancedAITools", lang) || "Enhanced AI Investigation Tools"} 
          subtitle={t("advancedAnalysisCapabilities", lang) || "Advanced Analysis Capabilities with Multi-API Integration"} 
        />
        
        <main className="p-6">
          <Tabs defaultValue="advanced-analysis" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="advanced-analysis" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>{lang === 'mr' ? 'प्रगत विश्लेषण' : 'Advanced Analysis'}</span>
              </TabsTrigger>
              <TabsTrigger value="threat-intel" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>{lang === 'mr' ? 'धमकी बुद्धिमत्ता' : 'Threat Intelligence'}</span>
              </TabsTrigger>
              <TabsTrigger value="pattern-analysis" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>{lang === 'mr' ? 'पॅटर्न विश्लेषण' : 'Pattern Analysis'}</span>
              </TabsTrigger>
              <TabsTrigger value="sms-alerts" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{lang === 'mr' ? 'SMS अलर्ट' : 'SMS Alerts'}</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{lang === 'mr' ? 'आपत्काल' : 'Emergency'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Advanced Analysis Tab */}
            <TabsContent value="advanced-analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>{lang === 'mr' ? 'उन्नत सायबर विश्लेषण' : 'Advanced Cyber Analysis'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="evidence-data">{lang === 'mr' ? 'पुरावा डेटा' : 'Evidence Data'}</Label>
                      <Textarea
                        id="evidence-data"
                        placeholder={lang === 'mr' ? 'डिजिटल पुरावा, लॉग फाइल्स, नेटवर्क ट्रॅफिक डेटा...' : 'Digital evidence, log files, network traffic data...'}
                        value={evidenceData}
                        onChange={(e) => setEvidenceData(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="case-context">{lang === 'mr' ? 'केस संदर्भ' : 'Case Context'}</Label>
                      <Textarea
                        id="case-context"
                        placeholder={lang === 'mr' ? 'केसचे तपशील, पीडित माहिती, प्रारंभिक निष्कर्ष...' : 'Case details, victim information, initial findings...'}
                        value={caseContext}
                        onChange={(e) => setCaseContext(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button 
                      onClick={handleAdvancedAnalysis}
                      disabled={advancedAnalysis.isPending || !evidenceData.trim() || !caseContext.trim()}
                      className="w-full"
                    >
                      {advancedAnalysis.isPending ? (
                        <>{lang === 'mr' ? 'विश्लेषण करत आहे...' : 'Analyzing...'}</>
                      ) : (
                        <>{lang === 'mr' ? 'प्रगत विश्लेषण सुरू करा' : 'Start Advanced Analysis'}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {advancedResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{lang === 'mr' ? 'विश्लेषण परिणाम' : 'Analysis Results'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{lang === 'mr' ? 'अत्याधुनिकता स्तर' : 'Sophistication Level'}</Label>
                          <Badge className={getPriorityColor(advancedResult.sophisticationLevel)}>
                            {advancedResult.sophisticationLevel}
                          </Badge>
                        </div>
                        <div>
                          <Label>{lang === 'mr' ? 'आक्रमण वेक्टर' : 'Attack Vectors'}</Label>
                          <div className="flex flex-wrap gap-1">
                            {advancedResult.attackVectors?.map((vector: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {vector}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label>{lang === 'mr' ? 'तात्काळ कृती' : 'Immediate Actions'}</Label>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {advancedResult.recommendedActions?.immediate?.map((action: string, idx: number) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label>{lang === 'mr' ? 'कायदेशीर तरतुदी' : 'Legal Provisions'}</Label>
                        <div className="flex flex-wrap gap-2">
                          {advancedResult.legalFramework?.applicableSections?.map((section: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{section}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Threat Intelligence Tab */}
            <TabsContent value="threat-intel" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>{lang === 'mr' ? 'सायबर गुन्हा बुद्धिमत्ता' : 'Cybercrime Intelligence'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{lang === 'mr' ? 'गुन्हाचा प्रकार' : 'Crime Type'}</Label>
                      <Select value={crimeType} onValueChange={setCrimeType}>
                        <SelectTrigger>
                          <SelectValue placeholder={lang === 'mr' ? 'गुन्हाचा प्रकार निवडा' : 'Select crime type'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phishing">Phishing</SelectItem>
                          <SelectItem value="ransomware">Ransomware</SelectItem>
                          <SelectItem value="financial_fraud">Financial Fraud</SelectItem>
                          <SelectItem value="identity_theft">Identity Theft</SelectItem>
                          <SelectItem value="cyber_stalking">Cyber Stalking</SelectItem>
                          <SelectItem value="data_breach">Data Breach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleThreatIntelligence}
                      disabled={cybercrimeIntelligence.isPending || !crimeType}
                      className="w-full"
                    >
                      {cybercrimeIntelligence.isPending ? (
                        <>{lang === 'mr' ? 'बुद्धिमत्ता गोळा करत आहे...' : 'Gathering Intelligence...'}</>
                      ) : (
                        <>{lang === 'mr' ? 'धमकी बुद्धिमत्ता मिळवा' : 'Get Threat Intelligence'}</>
                      )}
                    </Button>

                    <Separator />

                    <div>
                      <Label>{lang === 'mr' ? 'धमकी संकेतक' : 'Threat Indicators'}</Label>
                      <Textarea
                        placeholder={lang === 'mr' ? 'IP पत्ते, डोमेन नावे, फाइल हॅश, इत्यादी...' : 'IP addresses, domain names, file hashes, etc...'}
                        value={threatIndicators}
                        onChange={(e) => setThreatIndicators(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button 
                      onClick={handleThreatAnalysis}
                      disabled={threatAnalysis.isPending || !threatIndicators.trim()}
                      className="w-full"
                    >
                      {threatAnalysis.isPending ? (
                        <>{lang === 'mr' ? 'संकेतकांचे विश्लेषण करत आहे...' : 'Analyzing Indicators...'}</>
                      ) : (
                        <>{lang === 'mr' ? 'संकेतकांचे विश्लेषण करा' : 'Analyze Indicators'}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {intelligenceResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{lang === 'mr' ? 'बुद्धिमत्ता अहवाल' : 'Intelligence Report'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>{lang === 'mr' ? 'उत्तर' : 'Answer'}</Label>
                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                          {intelligenceResult.answer}
                        </div>
                      </div>
                      
                      {intelligenceResult.citations && intelligenceResult.citations.length > 0 && (
                        <div>
                          <Label>{lang === 'mr' ? 'संदर्भ' : 'Citations'}</Label>
                          <div className="space-y-1">
                            {intelligenceResult.citations.map((citation: string, idx: number) => (
                              <div key={idx} className="text-xs text-blue-600 hover:underline">
                                <a href={citation} target="_blank" rel="noopener noreferrer">
                                  {citation}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {intelligenceResult.relatedQuestions && intelligenceResult.relatedQuestions.length > 0 && (
                        <div>
                          <Label>{lang === 'mr' ? 'संबंधित प्रश्न' : 'Related Questions'}</Label>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {intelligenceResult.relatedQuestions.map((question: string, idx: number) => (
                              <li key={idx}>{question}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Pattern Analysis Tab */}
            <TabsContent value="pattern-analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>{lang === 'mr' ? 'आक्रमण पॅटर्न विश्लेषण' : 'Attack Pattern Analysis'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{lang === 'mr' ? 'सध्याचे केस डेटा' : 'Current Case Data'}</Label>
                      <Textarea
                        placeholder={lang === 'mr' ? 'केसचे तपशील, आक्रमणाचा प्रकार, वापरलेली पद्धत...' : 'Case details, attack type, methods used...'}
                        value={currentCase}
                        onChange={(e) => setCurrentCase(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button 
                      onClick={handlePatternAnalysis}
                      disabled={patternAnalysis.isPending || !currentCase.trim()}
                      className="w-full"
                    >
                      {patternAnalysis.isPending ? (
                        <>{lang === 'mr' ? 'पॅटर्नचे विश्लेषण करत आहे...' : 'Analyzing Patterns...'}</>
                      ) : (
                        <>{lang === 'mr' ? 'पॅटर्न विश्लेषण सुरू करा' : 'Start Pattern Analysis'}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {patternResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{lang === 'mr' ? 'पॅटर्न ओळख परिणाम' : 'Pattern Recognition Results'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>{lang === 'mr' ? 'आक्रमण स्वाक्षरी' : 'Attack Signature'}</Label>
                        <Badge variant="outline">{patternResult.attackSignature}</Badge>
                      </div>
                      
                      {patternResult.threatGroup && (
                        <div>
                          <Label>{lang === 'mr' ? 'धमकी गट' : 'Threat Group'}</Label>
                          <Badge className="bg-red-100 text-red-800">{patternResult.threatGroup}</Badge>
                        </div>
                      )}

                      <div>
                        <Label>{lang === 'mr' ? 'भौगोलिक मूळ' : 'Geographic Origin'}</Label>
                        <div className="flex flex-wrap gap-2">
                          {patternResult.geographicOrigin?.map((origin: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{origin}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>{lang === 'mr' ? 'शिफारस केलेले प्रतिकारक उपाय' : 'Recommended Countermeasures'}</Label>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {patternResult.recommendedCountermeasures?.map((measure: string, idx: number) => (
                            <li key={idx}>{measure}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* SMS Alerts Tab */}
            <TabsContent value="sms-alerts" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>{lang === 'mr' ? 'SMS अलर्ट सिस्टम' : 'SMS Alert System'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{lang === 'mr' ? 'फोन नंबर' : 'Phone Number'}</Label>
                      <Input
                        placeholder="+91XXXXXXXXXX"
                        value={alertPhone}
                        onChange={(e) => setAlertPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>{lang === 'mr' ? 'संदेश' : 'Message'}</Label>
                      <Textarea
                        placeholder={lang === 'mr' ? 'अलर्ट संदेश लिहा...' : 'Write alert message...'}
                        value={alertMessage}
                        onChange={(e) => setAlertMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>{lang === 'mr' ? 'प्राथमिकता' : 'Priority'}</Label>
                      <Select value={alertPriority} onValueChange={(value: any) => setAlertPriority(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{lang === 'mr' ? 'कमी' : 'Low'}</SelectItem>
                          <SelectItem value="medium">{lang === 'mr' ? 'मध्यम' : 'Medium'}</SelectItem>
                          <SelectItem value="high">{lang === 'mr' ? 'उच्च' : 'High'}</SelectItem>
                          <SelectItem value="critical">{lang === 'mr' ? 'गंभीर' : 'Critical'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={handleSMSAlert}
                      disabled={smsAlert.isPending || !alertPhone.trim() || !alertMessage.trim()}
                      className="w-full"
                    >
                      {smsAlert.isPending ? (
                        <>{lang === 'mr' ? 'पाठवत आहे...' : 'Sending...'}</>
                      ) : (
                        <>{lang === 'mr' ? 'SMS अलर्ट पाठवा' : 'Send SMS Alert'}</>
                      )}
                    </Button>
                    
                    {smsAlert.isSuccess && (
                      <Alert>
                        <AlertDescription>
                          {lang === 'mr' ? 'SMS अलर्ट यशस्वीरित्या पाठवला गेला!' : 'SMS alert sent successfully!'}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Emergency Alert Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{lang === 'mr' ? 'आपत्कालीन अलर्ट सिस्टम' : 'Emergency Alert System'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {lang === 'mr' ? 'हे आपत्कालीन परिस्थितीसाठी आहे. वापरण्यापूर्वी काळजीपूर्वक विचार करा.' : 'This is for emergency situations only. Use with caution.'}
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <Label>{lang === 'mr' ? 'घटनेचे वर्णन' : 'Incident Description'}</Label>
                    <Input
                      placeholder={lang === 'mr' ? 'आपत्कालीन घटनेचे संक्षिप्त वर्णन' : 'Brief description of emergency incident'}
                      value={incident}
                      onChange={(e) => setIncident(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>{lang === 'mr' ? 'स्थान' : 'Location'}</Label>
                    <Input
                      placeholder={lang === 'mr' ? 'घटनेचे स्थान' : 'Incident location'}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>{lang === 'mr' ? 'अधिकारी फोन नंबर (प्रत्येक ओळीत एक)' : 'Officer Phone Numbers (one per line)'}</Label>
                    <Textarea
                      placeholder={lang === 'mr' ? '+91XXXXXXXXXX\n+91XXXXXXXXXX\n+91XXXXXXXXXX' : '+91XXXXXXXXXX\n+91XXXXXXXXXX\n+91XXXXXXXXXX'}
                      value={officerPhones}
                      onChange={(e) => setOfficerPhones(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleEmergencyAlert}
                    disabled={emergencyAlert.isPending || !incident.trim() || !location.trim() || !officerPhones.trim()}
                    variant="destructive"
                    className="w-full"
                  >
                    {emergencyAlert.isPending ? (
                      <>{lang === 'mr' ? 'आपत्कालीन अलर्ट पाठवत आहे...' : 'Sending Emergency Alert...'}</>
                    ) : (
                      <>{lang === 'mr' ? 'आपत्कालीन अलर्ट पाठवा' : 'Send Emergency Alert'}</>
                    )}
                  </Button>
                  
                  {emergencyAlert.isSuccess && (
                    <Alert>
                      <AlertDescription>
                        {lang === 'mr' ? 'आपत्कालीन अलर्ट सर्व अधिकाऱ्यांना पाठवला गेला!' : 'Emergency alert sent to all officers!'}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}