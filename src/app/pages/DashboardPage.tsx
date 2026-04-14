import { Link } from "react-router";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Upload,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { mockDocuments } from "../../data/mockData";

const stats = [
  {
    title: "Total Documents",
    value: "52",
    change: "+12 this month",
    icon: FileText,
    color: "blue",
  },
  {
    title: "In Progress",
    value: "9",
    change: "Currently processing",
    icon: Clock,
    color: "amber",
  },
  {
    title: "Approved",
    value: "38",
    change: "+8 this week",
    icon: CheckCircle2,
    color: "green",
  },
  {
    title: "Failed",
    value: "5",
    change: "Requires attention",
    icon: AlertCircle,
    color: "red",
  },
];

export function DashboardPage() {
  const recentDocuments = mockDocuments.slice(0, 5);

  const mapToSimpleStatus = (status: string): "approved" | "in_progress" | "failed" => {
    // Map original statuses to simplified ones (same as Documents screen)
    if (status === "submitted" || status === "validated") return "approved";
    if (status === "failed") return "failed";
    return "in_progress"; // uploading, processing, ready, in_review
  };

  const getStatusBadge = (status: string) => {
    // Special handling for "processing" status - show "Data extracting..." in teal
    if (status === "processing") {
      return (
        <Badge variant="outline" className="bg-teal-100 text-teal-700 border-teal-200">
          Data extracting...
        </Badge>
      );
    }

    const simpleStatus = mapToSimpleStatus(status);
    const statusConfig = {
      approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200" },
      in_progress: { label: "In Progress", className: "bg-amber-100 text-amber-700 border-amber-200" },
      failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
    };

    const config = statusConfig[simpleStatus];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Welcome back! Here's what's happening with your documents today.
          </p>
        </div>
        <Link to="/upload">
          <Button className="gap-2 bg-[#111111] hover:bg-black">
            <Upload size={18} />
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-${stat.color}-50`}
                >
                  <Icon size={18} className={`text-${stat.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Documents */}
      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Documents</CardTitle>
              <Link to="/documents">
                <Button variant="ghost" size="sm" className="gap-2">
                  View All
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 truncate">{doc.name}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-sm text-slate-600">{doc.customer}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.pageCount} pages</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                      {doc.processingProgress !== undefined && (
                        <div className="mt-2">
                          <Progress value={doc.processingProgress} className="h-1.5" />
                          <p className="text-xs text-slate-500 mt-1">
                            Processing: {doc.processingProgress}%
                          </p>
                        </div>
                      )}
                      {doc.validationStatus && (
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="text-green-600">
                            ✓ {doc.validationStatus.validated} validated
                          </span>
                          {doc.validationStatus.missing > 0 && (
                            <span className="text-red-600">
                              ! {doc.validationStatus.missing} missing
                            </span>
                          )}
                          {doc.validationStatus.lowConfidence > 0 && (
                            <span className="text-amber-600">
                              ⚠ {doc.validationStatus.lowConfidence} low confidence
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {doc.status === "ready" || doc.status === "in_review" ? (
                    <Link to={`/review/${doc.id}`}>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </Link>
                  ) : doc.status === "processing" ? (
                    <Link to={`/processing/${doc.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}