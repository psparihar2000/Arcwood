import { useState } from "react";
import { Link } from "react-router";
import {
  FileText,
  Filter,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { mockHistory, HistoryEntry } from "../../data/mockData";

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const getStatusBadge = (status: HistoryEntry["status"]) => {
    const config = {
      success: {
        icon: CheckCircle2,
        variant: "default" as const,
        className: "bg-green-100 text-green-700 border-green-300",
        label: "Success",
      },
      failed: {
        icon: XCircle,
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700 border-red-300",
        label: "Failed",
      },
      pending: {
        icon: Clock,
        variant: "secondary" as const,
        className: "bg-amber-100 text-amber-700 border-amber-300",
        label: "Pending",
      },
    };

    const { icon: Icon, className, label } = config[status];
    return (
      <Badge variant="outline" className={`${className} gap-1.5`}>
        <Icon size={14} />
        {label}
      </Badge>
    );
  };

  const filteredHistory = mockHistory.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.mmsReference?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Document History</h1>
        <p className="text-sm text-slate-600 mt-1">
          View and manage all submitted documents and their audit trail
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {mockHistory.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">
              {mockHistory.filter((h) => h.status === "success").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-red-600">
              {mockHistory.filter((h) => h.status === "failed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-600">
              {mockHistory.filter((h) => h.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Search documents, customers, or MMS reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submission History</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fields</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MMS Ref</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <FileText size={48} className="text-slate-300 mx-auto mb-3" />
                      <p className="font-medium text-slate-900">No documents found</p>
                      <p className="text-sm text-slate-600 mt-1">
                        Try adjusting your filters
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded">
                            <FileText size={16} className="text-slate-900" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {entry.documentName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">{entry.customer}</TableCell>
                      <TableCell className="text-slate-700">{entry.submittedBy}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {formatDate(entry.submittedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.fieldsExtracted}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell>
                        {entry.mmsReference ? (
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {entry.mmsReference}
                          </code>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye size={16} />
                          </Button>
                          {entry.status === "failed" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw size={16} />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Error Details for Failed Items */}
          {filteredHistory.some((h) => h.status === "failed") && (
            <div className="mt-4 space-y-2">
              {filteredHistory
                .filter((h) => h.status === "failed" && h.errorMessage)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <XCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 text-sm">
                        {entry.documentName}
                      </p>
                      <p className="text-sm text-red-700 mt-1">{entry.errorMessage}</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <RefreshCw size={14} />
                      Retry
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}