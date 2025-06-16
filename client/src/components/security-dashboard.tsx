import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Activity, Users, Lock, FileText, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivities: number;
  activeUsers: number;
  failedLogins: number;
  avgResponseTime: number;
}

interface SecurityAlert {
  id: string;
  type: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  source: string;
}

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failure';
  details: string;
}

const SecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    suspiciousActivities: 0,
    activeUsers: 0,
    failedLogins: 0,
    avgResponseTime: 0,
  });

  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    // In production, fetch real data from API
    const fetchSecurityData = async () => {
      try {
        // Simulated data
        setMetrics({
          totalRequests: 15234,
          blockedRequests: 423,
          suspiciousActivities: 12,
          activeUsers: 45,
          failedLogins: 89,
          avgResponseTime: 245,
        });

        setAlerts([
          {
            id: '1',
            type: 'high',
            message: 'Multiple failed login attempts detected',
            timestamp: new Date().toISOString(),
            source: 'Authentication Service',
          },
          {
            id: '2',
            type: 'medium',
            message: 'Unusual file access pattern detected',
            timestamp: new Date().toISOString(),
            source: 'File Monitor',
          },
        ]);

        setAuditLogs([
          {
            id: '1',
            action: 'LOGIN',
            user: 'inspector.sharma',
            resource: 'auth',
            timestamp: new Date().toISOString(),
            status: 'success',
            details: 'Successful login from approved IP',
          },
          {
            id: '2',
            action: 'VIEW_CASE',
            user: 'constable.kumar',
            resource: 'cases',
            timestamp: new Date().toISOString(),
            status: 'failure',
            details: 'Insufficient permissions',
          },
        ]);
      } catch (error) {
        console.error('Error fetching security data:', error);
      }
    };

    fetchSecurityData();
    // In production, set up real-time updates
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Total Requests</div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalRequests}</div>
                <Progress
                  value={(metrics.blockedRequests / metrics.totalRequests) * 100}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.blockedRequests} blocked requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Active Users</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.failedLogins} failed login attempts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Response Time</div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgResponseTime}ms</div>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Average response time
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} variant={alert.type === 'high' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {alert.message}
                  <Badge className={getAlertColor(alert.type)}>
                    {alert.type.toUpperCase()}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="text-sm text-muted-foreground">
                    Source: {alert.source}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time: {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-muted-foreground">
                        User: {log.user}
                      </div>
                    </div>
                    <Badge
                      variant={log.status === 'success' ? 'default' : 'destructive'}
                    >
                      {log.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <div>Resource: {log.resource}</div>
                    <div>Details: {log.details}</div>
                    <div className="text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Security Metrics Over Time</h3>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: '00:00', requests: 145, blocked: 12 },
                      { name: '04:00', requests: 234, blocked: 23 },
                      { name: '08:00', requests: 456, blocked: 45 },
                      { name: '12:00', requests: 678, blocked: 67 },
                      { name: '16:00', requests: 567, blocked: 56 },
                      { name: '20:00', requests: 345, blocked: 34 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="#8884d8"
                      name="Total Requests"
                    />
                    <Line
                      type="monotone"
                      dataKey="blocked"
                      stroke="#82ca9d"
                      name="Blocked Requests"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
