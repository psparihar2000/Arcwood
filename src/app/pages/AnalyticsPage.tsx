import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TrendingUp, TrendingDown, FileText, Clock, CheckCircle2 } from "lucide-react";

const accuracyData = [
  { month: "Oct", accuracy: 89 },
  { month: "Nov", accuracy: 91 },
  { month: "Dec", accuracy: 88 },
  { month: "Jan", accuracy: 92 },
  { month: "Feb", accuracy: 93 },
  { month: "Mar", accuracy: 94 },
];

const volumeData = [
  { day: "Mon", processed: 24, validated: 22 },
  { day: "Tue", processed: 32, validated: 30 },
  { day: "Wed", processed: 28, validated: 25 },
  { day: "Thu", processed: 35, validated: 33 },
  { day: "Fri", processed: 41, validated: 38 },
  { day: "Sat", processed: 15, validated: 14 },
  { day: "Sun", processed: 12, validated: 11 },
];

const documentTypeData = [
  { name: "Purchase Orders", value: 145, color: "#64748b" },
  { name: "Invoices", value: 98, color: "#94a3b8" },
  { name: "Delivery Notes", value: 67, color: "#cbd5e1" },
  { name: "Contracts", value: 42, color: "#10b981" },
  { name: "Quotes", value: 38, color: "#f59e0b" },
];

const confidenceData = [
  { range: "90-100%", count: 284 },
  { range: "80-89%", count: 76 },
  { range: "70-79%", count: 42 },
  { range: "60-69%", count: 18 },
  { range: "<60%", count: 10 },
];

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics & Insights</h1>
          <p className="text-sm text-slate-600 mt-1">
            Track performance metrics and extraction accuracy
          </p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Documents
              </CardTitle>
              <FileText size={18} className="text-slate-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 mb-1">430</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg Processing Time
              </CardTitle>
              <Clock size={18} className="text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 mb-1">3.2 min</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingDown size={16} />
              <span>-8% faster</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Extraction Accuracy
              </CardTitle>
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 mb-1">94.2%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              <span>+2.1% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Manual Edits
              </CardTitle>
              <FileText size={18} className="text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 mb-1">5.8%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingDown size={16} />
              <span>-1.2% fewer edits</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Extraction Accuracy Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#111111"
                  strokeWidth={3}
                  dot={{ fill: "#111111", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Document Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="processed" fill="#111111" name="Processed" />
                <Bar dataKey="validated" fill="#10b981" name="Validated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Types */}
        <Card>
          <CardHeader>
            <CardTitle>Document Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Confidence Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={confidenceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="range" type="category" stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Field Extractions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { field: "PO Number", accuracy: 98.5, count: 145 },
              { field: "Currency", accuracy: 97.2, count: 430 },
              { field: "Vendor Name", accuracy: 95.8, count: 412 },
              { field: "Order Date", accuracy: 94.3, count: 398 },
              { field: "Payment Terms", accuracy: 92.1, count: 367 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{item.field}</span>
                    <span className="text-sm text-slate-600">
                      {item.accuracy}% ({item.count} documents)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}