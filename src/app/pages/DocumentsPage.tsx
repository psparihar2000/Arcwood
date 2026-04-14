import { useNavigate } from "react-router";
import { FileText, Eye, Download, Trash2, Filter, Search, Edit3, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { mockDocuments, Document } from "../../data/mockData";
import { useState } from "react";
import { toast } from "sonner";

type FilterStatus = "approved" | "in_progress" | "failed";

export function DocumentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState<FilterStatus[]>([]);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [renameDialog, setRenameDialog] = useState<{ open: boolean; docId: string | null }>({
    open: false,
    docId: null,
  });
  const [newDocumentName, setNewDocumentName] = useState("");

  const mapToSimpleStatus = (status: string): FilterStatus => {
    // Map original statuses to simplified ones
    if (status === "submitted" || status === "validated") return "approved";
    if (status === "failed") return "failed";
    return "in_progress"; // uploading, processing, ready, in_review
  };

  const getStatusBadge = (status: string) => {
    const simpleStatus = mapToSimpleStatus(status);
    const statusConfig = {
      approved: { label: "Approved", className: "bg-green-100 text-green-700 border-green-200" },
      in_progress: { label: "In Progress", className: "bg-amber-100 text-amber-700 border-amber-200" },
      failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
    };

    const config = statusConfig[simpleStatus];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const toggleStatusFilter = (status: FilterStatus) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
  };

  const openRenameDialog = (docId: string, currentName: string) => {
    setRenameDialog({ open: true, docId });
    setNewDocumentName(currentName);
  };

  const closeRenameDialog = () => {
    setRenameDialog({ open: false, docId: null });
    setNewDocumentName("");
  };

  const handleRename = () => {
    if (!renameDialog.docId || !newDocumentName.trim()) {
      toast.error("Document name cannot be empty");
      return;
    }

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === renameDialog.docId
          ? { ...doc, name: newDocumentName.trim() }
          : doc
      )
    );

    toast.success("Document renamed successfully");
    closeRenameDialog();
  };

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

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilters.length === 0 ||
      statusFilters.includes(mapToSimpleStatus(doc.status));

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (docId: string, status: string) => {
    if (status === "ready" || status === "in_review") {
      navigate(`/review/${docId}`);
    } else if (status === "processing") {
      navigate(`/processing/${docId}`);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Documents</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                View and manage all uploaded documents
              </p>
            </div>
            <Button onClick={() => navigate("/upload")} className="gap-2">
              <FileText size={18} />
              Upload New
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={18} />
                  Filter
                  {statusFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {statusFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes("approved")}
                  onCheckedChange={() => toggleStatusFilter("approved")}
                >
                  Approved
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes("in_progress")}
                  onCheckedChange={() => toggleStatusFilter("in_progress")}
                >
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes("failed")}
                  onCheckedChange={() => toggleStatusFilter("failed")}
                >
                  Failed
                </DropdownMenuCheckboxItem>
                {statusFilters.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full justify-start gap-2"
                    >
                      <X size={14} />
                      Clear filters
                    </Button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 w-16">Sr No.</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Document</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Uploaded</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Size</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-900 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      {statusFilters.length > 0 ? "No documents match the selected filters" : "No documents found"}
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc, index) => (
                    <tr
                      key={doc.id}
                      onClick={() => handleRowClick(doc.id, doc.status)}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.pageCount} pages</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">{doc.type}</td>
                      <td className="py-4 px-4 text-sm text-slate-700">{doc.customer}</td>
                      <td className="py-4 px-4">{getStatusBadge(doc.status)}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        <div>
                          <p>{formatDate(doc.uploadDate)}</p>
                          <p className="text-xs text-slate-500">by {doc.uploadedBy}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{doc.size}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRenameDialog(doc.id, doc.name);
                            }}
                            title="Rename Document"
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            onClick={(e) => e.stopPropagation()}
                            title="Download"
                          >
                            <Download size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => e.stopPropagation()}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredDocuments.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <p>Showing {filteredDocuments.length} of {documents.length} documents</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={renameDialog.open} onOpenChange={closeRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for the document. The file extension will be preserved.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="document-name" className="text-sm font-medium text-slate-900">
              Document Name
            </Label>
            <Input
              id="document-name"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              placeholder="Enter document name"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeRenameDialog}>
              Cancel
            </Button>
            <Button onClick={handleRename} className="bg-[#111111] hover:bg-black">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
