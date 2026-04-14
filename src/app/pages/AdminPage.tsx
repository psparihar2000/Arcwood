import { useState } from "react";
import {
  Users,
  Settings,
  Key,
  Database,
  Activity,
  Shield,
  Save,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";

const mockUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@arcwood.com",
    role: "SME",
    status: "active",
    lastLogin: "2024-03-24T08:30:00",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@arcwood.com",
    role: "SME",
    status: "active",
    lastLogin: "2024-03-24T09:15:00",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@arcwood.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-03-23T16:45:00",
  },
  {
    id: 4,
    name: "David Park",
    email: "david.park@arcwood.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: "2024-03-20T14:20:00",
  },
];

export function AdminPage() {
  const [autoSave, setAutoSave] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState("70");
  const [mmsEndpoint, setMmsEndpoint] = useState("https://api.mms.company.com/v2");

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleTestConnection = () => {
    toast.success("MMS connection successful");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Administration</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage users, system settings, and integrations
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users size={16} />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
          <TabsTrigger value="integration" className="gap-2">
            <Database size={16} />
            Integration
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user access and roles</CardDescription>
                </div>
                <Button className="gap-2 bg-[#111111] hover:bg-black">
                  <Users size={16} />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-slate-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "default" : "outline"}
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {formatDate(user.lastLogin)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-900">{mockUsers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-green-600">
                  {mockUsers.filter((u) => u.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Inactive Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-400">
                  {mockUsers.filter((u) => u.status === "inactive").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Processing Settings</CardTitle>
              <CardDescription>Configure AI extraction and validation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save drafts</Label>
                  <p className="text-sm text-slate-500">
                    Automatically save changes during review
                  </p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence">Minimum Confidence Threshold</Label>
                <Select value={confidenceThreshold} onValueChange={setConfidenceThreshold}>
                  <SelectTrigger id="confidence">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60% - Lenient</SelectItem>
                    <SelectItem value="70">70% - Balanced</SelectItem>
                    <SelectItem value="80">80% - Strict</SelectItem>
                    <SelectItem value="90">90% - Very Strict</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">
                  Fields below this threshold will be flagged for review
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocr">OCR Engine</Label>
                <Select defaultValue="advanced">
                  <SelectTrigger id="ocr">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard OCR</SelectItem>
                    <SelectItem value="advanced">Advanced OCR + AI</SelectItem>
                    <SelectItem value="premium">Premium Neural OCR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="retention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Field Configuration</CardTitle>
              <CardDescription>Manage required fields and validation rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "PO Number",
                "Vendor Name",
                "Order Date",
                "Total Amount",
                "Tax Amount",
                "Contact Email",
              ].map((field) => (
                <div key={field} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <span className="font-medium text-slate-900">{field}</span>
                  </div>
                  <Badge variant="outline">Required</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={handleSave} className="gap-2 bg-[#111111] hover:bg-black">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MMS/ERP Integration</CardTitle>
              <CardDescription>Configure connection to your MMS or ERP system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  value={mmsEndpoint}
                  onChange={(e) => setMmsEndpoint(e.target.value)}
                  placeholder="https://api.mms.company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type="password"
                    defaultValue="••••••••••••••••••••"
                  />
                  <Key size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                <Input id="timeout" type="number" defaultValue="30" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-slate-900" />
                  <div>
                    <p className="font-medium text-slate-900">Connection Status</p>
                    <p className="text-sm text-slate-700">Last tested: 2 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-green-600">Connected</Badge>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleTestConnection} className="gap-2">
                  <RefreshCw size={16} />
                  Test Connection
                </Button>
                <Button onClick={handleSave} className="gap-2 bg-[#111111] hover:bg-black">
                  <Save size={16} />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SSO Configuration</CardTitle>
              <CardDescription>Configure Single Sign-On providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Microsoft Azure AD</p>
                    <p className="text-sm text-slate-600">SAML 2.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600">Active</Badge>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                    <Shield size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Okta</p>
                    <p className="text-sm text-slate-600">SAML 2.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600">Active</Badge>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance</CardTitle>
              <CardDescription>Manage security settings and audit logs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-slate-500">Require 2FA for all users</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-slate-500">Log all user actions and changes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP Whitelisting</Label>
                  <p className="text-sm text-slate-500">Restrict access to specific IP ranges</p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Session Timeout (minutes)</Label>
                <Input id="session" type="number" defaultValue="60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { event: "User login", user: "sarah.johnson@arcwood.com", time: "5 min ago" },
                  { event: "Settings changed", user: "emily.rodriguez@arcwood.com", time: "2 hours ago" },
                  { event: "User added", user: "emily.rodriguez@arcwood.com", time: "1 day ago" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{item.event}</p>
                      <p className="text-sm text-slate-600">{item.user}</p>
                    </div>
                    <span className="text-sm text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}