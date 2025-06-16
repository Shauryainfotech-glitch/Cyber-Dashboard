import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, Users, Key, Clock, AlertTriangle, Settings } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { queryClient } from "@/lib/queryClient";
import { SecuritySetting, Role, Permission } from "@shared/schema";

export default function SecuritySettings() {
  const [selectedCategory, setSelectedCategory] = useState("auth");

  const { data: securitySettings, isLoading } = useQuery({
    queryKey: ["/api/security/settings"],
  });

  const { data: roles } = useQuery({
    queryKey: ["/api/security/roles"],
  });

  const { data: permissions } = useQuery({
    queryKey: ["/api/security/permissions"],
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/security/settings/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) throw new Error("Failed to update setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/settings"] });
    },
  });

  const roleHierarchy = [
    { id: 1, name: "SP", displayName: "Superintendent of Police", level: 1, color: "bg-red-100 text-red-800" },
    { id: 2, name: "ADDL_SP", displayName: "Additional SP", level: 2, color: "bg-orange-100 text-orange-800" },
    { id: 3, name: "DYSP", displayName: "Deputy Superintendent of Police", level: 3, color: "bg-yellow-100 text-yellow-800" },
    { id: 4, name: "INSPECTOR", displayName: "Inspector", level: 4, color: "bg-green-100 text-green-800" },
    { id: 5, name: "ASI", displayName: "Assistant Sub Inspector", level: 5, color: "bg-blue-100 text-blue-800" },
    { id: 6, name: "HC", displayName: "Head Constable", level: 6, color: "bg-indigo-100 text-indigo-800" },
    { id: 7, name: "CONSTABLE", displayName: "Constable", level: 7, color: "bg-purple-100 text-purple-800" },
  ];

  const departments = [
    { value: "cyber_crime", label: "Cyber Crime Branch" },
    { value: "law_order", label: "Law & Order" },
    { value: "traffic", label: "Traffic Police" },
    { value: "special_branch", label: "Special Branch" },
    { value: "crime_branch", label: "Crime Branch" },
  ];

  const settingCategories = [
    { value: "auth", label: "Authentication", icon: Key },
    { value: "session", label: "Session Management", icon: Clock },
    { value: "password", label: "Password Policy", icon: Shield },
    { value: "audit", label: "Audit & Logging", icon: AlertTriangle },
    { value: "access", label: "Access Control", icon: Users },
  ];

  const handleSettingUpdate = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <Sidebar />
        <div className="pl-64">
          <Header title="Security Settings" subtitle="Configure system security and access controls" />
          <div className="p-6">
            <div className="text-center">Loading security settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="pl-64">
        <Header 
          title="Security Settings Console"
          subtitle="Ahilyanagar SP Office - Security Configuration & RBAC Management"
        />
        
        <main className="p-6">
          <Tabs defaultValue="hierarchy" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hierarchy">Role Hierarchy</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="security">Security Settings</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="hierarchy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Ahilyanagar SP Office Hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roleHierarchy.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Badge className={role.color}>
                            Level {role.level}
                          </Badge>
                          <div>
                            <h3 className="font-semibold">{role.displayName}</h3>
                            <p className="text-sm text-gray-600">{role.name}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit Permissions
                          </Button>
                          <Button variant="outline" size="sm">
                            View Users
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <div key={dept.value} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{dept.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Assigned officers and role distribution
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Manage Roles
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Permission Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Resource Permissions</h3>
                      <div className="space-y-2">
                        {['Cases', 'Evidence', 'Complaints', 'Users', 'Reports'].map((resource) => (
                          <div key={resource} className="flex items-center justify-between p-3 border rounded">
                            <span>{resource}</span>
                            <div className="flex space-x-1">
                              {['View', 'Create', 'Edit', 'Delete'].map((action) => (
                                <Badge key={action} variant="outline" className="text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Role-based Access Matrix</h3>
                      <div className="text-sm space-y-2">
                        <div className="grid grid-cols-5 gap-2 font-medium border-b pb-2">
                          <span>Role</span>
                          <span>Cases</span>
                          <span>Evidence</span>
                          <span>Reports</span>
                          <span>Admin</span>
                        </div>
                        {roleHierarchy.slice(0, 5).map((role) => (
                          <div key={role.id} className="grid grid-cols-5 gap-2 py-1">
                            <span className="text-xs">{role.name}</span>
                            <Badge variant={role.level <= 3 ? "default" : "outline"} className="text-xs">
                              {role.level <= 3 ? "Full" : "Read"}
                            </Badge>
                            <Badge variant={role.level <= 4 ? "default" : "outline"} className="text-xs">
                              {role.level <= 4 ? "Full" : "Read"}
                            </Badge>
                            <Badge variant={role.level <= 2 ? "default" : "outline"} className="text-xs">
                              {role.level <= 2 ? "Full" : "None"}
                            </Badge>
                            <Badge variant={role.level === 1 ? "default" : "outline"} className="text-xs">
                              {role.level === 1 ? "Full" : "None"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {settingCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card key={category.value}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Icon className="h-5 w-5 mr-2" />
                          {category.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {category.value === "auth" && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label>Two-Factor Authentication</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Single Sign-On (SSO)</Label>
                              <Switch />
                            </div>
                            <div>
                              <Label>Maximum Login Attempts</Label>
                              <Input type="number" defaultValue="3" className="mt-1" />
                            </div>
                          </>
                        )}
                        
                        {category.value === "session" && (
                          <>
                            <div>
                              <Label>Session Timeout (minutes)</Label>
                              <Input type="number" defaultValue="30" className="mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Remember Me Option</Label>
                              <Switch defaultChecked />
                            </div>
                            <div>
                              <Label>Maximum Concurrent Sessions</Label>
                              <Input type="number" defaultValue="3" className="mt-1" />
                            </div>
                          </>
                        )}

                        {category.value === "password" && (
                          <>
                            <div>
                              <Label>Minimum Password Length</Label>
                              <Input type="number" defaultValue="8" className="mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Require Special Characters</Label>
                              <Switch defaultChecked />
                            </div>
                            <div>
                              <Label>Password Expiry (days)</Label>
                              <Input type="number" defaultValue="90" className="mt-1" />
                            </div>
                          </>
                        )}

                        {category.value === "audit" && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label>Enable Audit Logging</Label>
                              <Switch defaultChecked />
                            </div>
                            <div>
                              <Label>Log Retention Period (days)</Label>
                              <Input type="number" defaultValue="365" className="mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Real-time Alerts</Label>
                              <Switch defaultChecked />
                            </div>
                          </>
                        )}

                        {category.value === "access" && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label>IP Address Restrictions</Label>
                              <Switch />
                            </div>
                            <div>
                              <Label>Allowed IP Ranges</Label>
                              <Textarea placeholder="192.168.1.0/24" className="mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Time-based Access Control</Label>
                              <Switch />
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Security Audit Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Login Attempt", user: "Inspector Sharma", timestamp: "2 minutes ago", status: "Success", ip: "192.168.1.45" },
                      { action: "Permission Change", user: "SP Patel", timestamp: "15 minutes ago", status: "Success", ip: "192.168.1.10" },
                      { action: "Case Access", user: "ASI Kumar", timestamp: "1 hour ago", status: "Success", ip: "192.168.1.67" },
                      { action: "Failed Login", user: "Unknown", timestamp: "2 hours ago", status: "Failed", ip: "203.45.67.89" },
                      { action: "Data Export", user: "DYSP Singh", timestamp: "3 hours ago", status: "Success", ip: "192.168.1.23" },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-4">
                          <Badge variant={log.status === "Success" ? "default" : "destructive"} className="text-xs">
                            {log.status}
                          </Badge>
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-gray-600">{log.user} • {log.ip}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}