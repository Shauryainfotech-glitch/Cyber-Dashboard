import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Memory, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Database,
  Lock,
  Zap,
  Server,
  Network
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { t, Language } from "@/lib/translations";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function SystemMonitoring() {
  const [lang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem("ccms-language") as Language) || "en";
    }
    return "en";
  });

  const [selectedService, setSelectedService] = useState<string>('');

  // System Health Query
  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/system/health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Real-time Alerts Query
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/alerts/dashboard/system'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Blockchain Status Query
  const { data: blockchainStatus } = useQuery({
    queryKey: ['/api/blockchain/status'],
    refetchInterval: 60000, // Refresh every minute
  });

  // ML Models Status Query
  const { data: mlModels } = useQuery({
    queryKey: ['/api/ml/models/status'],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  // Emergency Alert Mutation
  const emergencyBroadcast = useMutation({
    mutationFn: async (emergency: any) => {
      return apiRequest("/api/alerts/emergency-broadcast", "POST", { emergency });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-100 text-green-800 border-green-200';
      case 'DEGRADED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DOWN': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEmergencyTest = () => {
    emergencyBroadcast.mutate({
      title: lang === 'mr' ? 'सिस्टम चाचणी' : 'System Test',
      message: lang === 'mr' ? 'हा एक चाचणी संदेश आहे' : 'This is a test message',
      location: 'System Monitoring Console',
      incidentType: 'SYSTEM_TEST',
      priority: 'URGENT',
      requiredRoles: ['SYSTEM_ADMIN', 'TECHNICAL_SUPPORT']
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header 
          title={t("systemMonitoring", lang) || "System Monitoring & Health"} 
          subtitle={t("realTimeSystemStatus", lang) || "Real-time System Status & Performance Metrics"} 
        />
        
        <main className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>{lang === 'mr' ? 'सिंहावलोकन' : 'Overview'}</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center space-x-2">
                <Server className="h-4 w-4" />
                <span>{lang === 'mr' ? 'सेवा' : 'Services'}</span>
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>{lang === 'mr' ? 'ब्लॉकचेन' : 'Blockchain'}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>{lang === 'mr' ? 'सुरक्षा' : 'Security'}</span>
              </TabsTrigger>
              <TabsTrigger value="ml-models" className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>{lang === 'mr' ? 'ML मॉडेल्स' : 'ML Models'}</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{lang === 'mr' ? 'अलर्ट' : 'Alerts'}</span>
              </TabsTrigger>
            </TabsList>

            {/* System Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {lang === 'mr' ? 'सिस्टम लोड' : 'System Load'}
                    </CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {systemHealth?.systemLoad?.toFixed(1) || 0}%
                    </div>
                    <Progress value={systemHealth?.systemLoad || 0} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {lang === 'mr' ? 'तासभरातील अलर्ट' : 'Alerts (1h)'}
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {systemHealth?.alertsLastHour || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {systemHealth?.criticalAlerts || 0} {lang === 'mr' ? 'गंभीर' : 'critical'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {lang === 'mr' ? 'सक्रिय सेवा' : 'Active Services'}
                    </CardTitle>
                    <Server className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {systemHealth?.services?.filter((s: any) => s.status === 'HEALTHY').length || 0}
                      /{systemHealth?.services?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {lang === 'mr' ? 'निरोगी सेवा' : 'healthy services'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {lang === 'mr' ? 'ब्लॉकचेन स्थिती' : 'Blockchain Status'}
                    </CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">
                        {lang === 'mr' ? 'सिंक्रोनाइझ्ड' : 'Synchronized'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {lang === 'mr' ? 'ब्लॉक उंची: ' : 'Block height: '}1,234,567
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Service Health Grid */}
              <Card>
                <CardHeader>
                  <CardTitle>{lang === 'mr' ? 'सेवा आरोग्य' : 'Service Health'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemHealth?.services?.map((service: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{service.name}</span>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'प्रतिसाद वेळ:' : 'Response time:'}</span>
                            <span>{service.responseTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'त्रुटी दर:' : 'Error rate:'}</span>
                            <span>{(service.errorRate * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Microservices Status */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'मायक्रोसेवा स्थिती' : 'Microservice Status'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'User Management Service', status: 'HEALTHY', cpu: 15, memory: 45 },
                        { name: 'Case Service', status: 'HEALTHY', cpu: 22, memory: 38 },
                        { name: 'Evidence Service', status: 'HEALTHY', cpu: 18, memory: 52 },
                        { name: 'AI/ML Service', status: 'DEGRADED', cpu: 78, memory: 86 },
                        { name: 'Blockchain Service', status: 'HEALTHY', cpu: 12, memory: 34 },
                        { name: 'Quantum Security', status: 'HEALTHY', cpu: 8, memory: 28 }
                      ].map((service, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium">{service.name}</span>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <span>CPU</span>
                                <span>{service.cpu}%</span>
                              </div>
                              <Progress value={service.cpu} className="mt-1" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Memory</span>
                                <span>{service.memory}%</span>
                              </div>
                              <Progress value={service.memory} className="mt-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'API कार्यप्रदर्शन' : 'API Performance'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { endpoint: '/api/cases', requests: 1250, avgTime: 120, errors: 2 },
                        { endpoint: '/api/evidence', requests: 890, avgTime: 180, errors: 1 },
                        { endpoint: '/api/analysis/advanced', requests: 456, avgTime: 850, errors: 8 },
                        { endpoint: '/api/blockchain/evidence', requests: 234, avgTime: 320, errors: 0 },
                        { endpoint: '/api/ml/classify-incident', requests: 167, avgTime: 1200, errors: 3 }
                      ].map((api, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {api.endpoint}
                            </code>
                            <span className={`text-sm px-2 py-1 rounded ${api.errors > 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {api.errors} errors
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Requests/hour: </span>
                              <span className="font-medium">{api.requests}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Avg time: </span>
                              <span className="font-medium">{api.avgTime}ms</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Blockchain Monitoring */}
            <TabsContent value="blockchain" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'ब्लॉकचेन नेटवर्क' : 'Blockchain Network'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Database className="h-8 w-8 text-blue-500" />
                          <div>
                            <div className="font-medium">Evidence Chain</div>
                            <div className="text-sm text-gray-600">Hyperledger Fabric</div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">1,234,567</div>
                          <div className="text-sm text-gray-600">{lang === 'mr' ? 'ब्लॉक उंची' : 'Block Height'}</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">98.7%</div>
                          <div className="text-sm text-gray-600">{lang === 'mr' ? 'अखंडता स्कोअर' : 'Integrity Score'}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">{lang === 'mr' ? 'अलीकडील व्यवहार' : 'Recent Transactions'}</h4>
                        {[
                          { type: 'EVIDENCE_STORAGE', hash: '0x1a2b3c...', time: '2 min ago' },
                          { type: 'AUDIT_TRAIL', hash: '0x4d5e6f...', time: '5 min ago' },
                          { type: 'CHAIN_CUSTODY', hash: '0x7g8h9i...', time: '8 min ago' }
                        ].map((tx, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="text-sm font-medium">{tx.type}</div>
                              <div className="text-xs text-gray-600">{tx.hash}</div>
                            </div>
                            <div className="text-xs text-gray-600">{tx.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'साक्ष अखंडता' : 'Evidence Integrity'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">100%</div>
                        <div className="text-sm text-gray-600">
                          {lang === 'mr' ? 'सत्यापित साक्ष' : 'Verified Evidence'}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">{lang === 'mr' ? 'साक्ष सांख्यिकी' : 'Evidence Statistics'}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'एकूण साक्ष:' : 'Total Evidence:'}</span>
                            <span className="font-medium">2,456</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'सत्यापित:' : 'Verified:'}</span>
                            <span className="font-medium text-green-600">2,456</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'प्रलंबित:' : 'Pending:'}</span>
                            <span className="font-medium text-yellow-600">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'छेडछाड:' : 'Tampered:'}</span>
                            <span className="font-medium text-red-600">0</span>
                          </div>
                        </div>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          {lang === 'mr' 
                            ? 'सर्व साक्ष ब्लॉकचेनवर सुरक्षित आहेत आणि सत्यापित आहेत।'
                            : 'All evidence is secured on blockchain and verified.'
                          }
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Monitoring */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'क्वांटम सुरक्षा' : 'Quantum Security'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Lock className="h-8 w-8 text-purple-500" />
                          <div>
                            <div className="font-medium">Quantum Key Distribution</div>
                            <div className="text-sm text-gray-600">CRYSTALS-Kyber 1024</div>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">95%</div>
                          <div className="text-sm text-gray-600">{lang === 'mr' ? 'क्वांटम सुरक्षा स्तर' : 'Quantum Safe Level'}</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">156</div>
                          <div className="text-sm text-gray-600">{lang === 'mr' ? 'सक्रिय की' : 'Active Keys'}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">{lang === 'mr' ? 'बायोमेट्रिक प्रमाणीकरण' : 'Biometric Authentication'}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'नोंदणीकृत:' : 'Enrolled:'}</span>
                            <span className="font-medium">89</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'सक्रिय:' : 'Active:'}</span>
                            <span className="font-medium">87</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'यशस्वी प्रमाणीकरण:' : 'Success Rate:'}</span>
                            <span className="font-medium text-green-600">98.7%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'mr' ? 'अयशस्वी प्रयत्न:' : 'Failed Attempts:'}</span>
                            <span className="font-medium text-red-600">12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'सुरक्षा घटना' : 'Security Incidents'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 border rounded-lg">
                          <div className="text-xl font-bold text-green-600">0</div>
                          <div className="text-xs text-gray-600">{lang === 'mr' ? 'गंभीर' : 'Critical'}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-xl font-bold text-yellow-600">2</div>
                          <div className="text-xs text-gray-600">{lang === 'mr' ? 'मध्यम' : 'Medium'}</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-xl font-bold text-blue-600">8</div>
                          <div className="text-xs text-gray-600">{lang === 'mr' ? 'कमी' : 'Low'}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">{lang === 'mr' ? 'अलीकडील घटना' : 'Recent Incidents'}</h4>
                        {[
                          { type: 'Multiple Login Attempts', severity: 'MEDIUM', time: '15 min ago' },
                          { type: 'Unusual Data Access', severity: 'LOW', time: '1 hour ago' },
                          { type: 'Failed API Authentication', severity: 'LOW', time: '2 hours ago' }
                        ].map((incident, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="text-sm font-medium">{incident.type}</div>
                              <div className="text-xs text-gray-600">{incident.time}</div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        onClick={handleEmergencyTest}
                        variant="outline" 
                        className="w-full"
                        disabled={emergencyBroadcast.isPending}
                      >
                        {emergencyBroadcast.isPending ? (
                          <>{lang === 'mr' ? 'पाठवत आहे...' : 'Sending...'}</>
                        ) : (
                          <>{lang === 'mr' ? 'आपत्कालीन चाचणी' : 'Test Emergency Alert'}</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ML Models Status */}
            <TabsContent value="ml-models" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'ML मॉडेल कार्यप्रदर्शन' : 'ML Model Performance'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Cybercrime Classifier', accuracy: 94.3, status: 'ACTIVE', predictions: 1250 },
                        { name: 'Fraud Detection', accuracy: 96.2, status: 'ACTIVE', predictions: 890 },
                        { name: 'Threat Predictor', accuracy: 89.3, status: 'ACTIVE', predictions: 456 },
                        { name: 'NLP Sentiment Analyzer', accuracy: 91.5, status: 'TRAINING', predictions: 234 }
                      ].map((model, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium">{model.name}</span>
                            <Badge className={model.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {model.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">{lang === 'mr' ? 'अचूकता:' : 'Accuracy:'} </span>
                              <span className="font-medium">{model.accuracy}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">{lang === 'mr' ? 'अंदाज:' : 'Predictions:'} </span>
                              <span className="font-medium">{model.predictions}</span>
                            </div>
                          </div>
                          <Progress value={model.accuracy} className="mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{lang === 'mr' ? 'मॉडेल मेट्रिक्स' : 'Model Metrics'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">4</div>
                          <div className="text-sm text-gray-600">{lang === 'mr' ? 'सक्रिय मॉडेल्स' : 'Active Models'}</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">2,830</div>
                          <div className="text-sm text-gray-600">{lang === 'mr' ? 'दैनिक अंदाज' : 'Daily Predictions'}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">{lang === 'mr' ? 'मॉडेल वापर' : 'Model Usage'}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Classification</span>
                            <span>45%</span>
                          </div>
                          <Progress value={45} />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Fraud Detection</span>
                            <span>32%</span>
                          </div>
                          <Progress value={32} />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Threat Prediction</span>
            <span>16%</span>
                          </div>
                          <Progress value={16} />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Sentiment Analysis</span>
                            <span>7%</span>
                          </div>
                          <Progress value={7} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Real-time Alerts */}
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{lang === 'mr' ? 'रिअल-टाइम अलर्ट' : 'Real-time Alerts'}</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">
                    {alerts?.totalActive || 0} {lang === 'mr' ? 'सक्रिय' : 'Active'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="critical" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="critical">
                        {lang === 'mr' ? 'गंभीर' : 'Critical'} ({alerts?.critical?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="high">
                        {lang === 'mr' ? 'उच्च' : 'High'} ({alerts?.high?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="medium">
                        {lang === 'mr' ? 'मध्यम' : 'Medium'} ({alerts?.medium?.length || 0})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="critical" className="space-y-4 mt-4">
                      {alerts?.critical?.length > 0 ? (
                        alerts.critical.map((alert: any, index: number) => (
                          <Alert key={index} className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <div className="ml-2">
                              <div className="font-medium text-red-800">{alert.title}</div>
                              <div className="text-sm text-red-700">{alert.message}</div>
                              <div className="text-xs text-red-600 mt-1">
                                {new Date(alert.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </Alert>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {lang === 'mr' ? 'कोणतेही गंभीर अलर्ट नाहीत' : 'No critical alerts'}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="high" className="space-y-4 mt-4">
                      {alerts?.high?.length > 0 ? (
                        alerts.high.map((alert: any, index: number) => (
                          <Alert key={index} className="border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <div className="ml-2">
                              <div className="font-medium text-orange-800">{alert.title}</div>
                              <div className="text-sm text-orange-700">{alert.message}</div>
                              <div className="text-xs text-orange-600 mt-1">
                                {new Date(alert.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </Alert>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {lang === 'mr' ? 'कोणतेही उच्च अलर्ट नाहीत' : 'No high priority alerts'}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="medium" className="space-y-4 mt-4">
                      {alerts?.medium?.length > 0 ? (
                        alerts.medium.map((alert: any, index: number) => (
                          <Alert key={index} className="border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <div className="ml-2">
                              <div className="font-medium text-yellow-800">{alert.title}</div>
                              <div className="text-sm text-yellow-700">{alert.message}</div>
                              <div className="text-xs text-yellow-600 mt-1">
                                {new Date(alert.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </Alert>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {lang === 'mr' ? 'कोणतेही मध्यम अलर्ट नाहीत' : 'No medium priority alerts'}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}