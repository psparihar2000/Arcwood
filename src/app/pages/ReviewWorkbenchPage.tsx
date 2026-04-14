import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowLeft,
  Download,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { DocumentViewer } from "../components/DocumentViewer";
import { FieldEditor } from "../components/FieldEditor";
import { ExportDialog } from "../components/ExportDialog";
import { mockFields, mockDocuments, DocumentField } from "../../data/mockData";
import { ScrollArea } from "../components/ui/scroll-area";

export function ReviewWorkbenchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState<DocumentField[]>(mockFields);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [filterView, setFilterView] = useState<"all" | "missing" | "low-confidence">("all");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [layoutSwapped, setLayoutSwapped] = useState(false);

  const document = mockDocuments.find((d) => d.id === id);
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const handleFieldUpdate = (fieldId: string, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              value,
              edited: value !== f.originalValue && f.originalValue !== undefined,
            }
          : f
      )
    );
  };

  const handleFieldApprove = (fieldId: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              approved: !f.approved,
            }
          : f
      )
    );
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      toast.success(field.approved ? "Field approval removed" : "Field approved");
    }
  };

  const handleApproveAll = () => {
    const allApproved = fields.every((f) => f.approved);
    setFields((prev) =>
      prev.map((f) => ({
        ...f,
        approved: !allApproved,
      }))
    );
    toast.success(allApproved ? "All approvals removed" : "All fields approved");
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSubmitDialog(false);
    navigate("/history");
    toast.success("Document submitted to MMS successfully");
  };

  const getFilteredFields = () => {
    if (filterView === "missing") {
      return fields.filter((f) => !f.value || f.value.trim() === "");
    }
    if (filterView === "low-confidence") {
      return fields.filter((f) => f.confidence === "low" || f.confidence === "medium");
    }
    return fields;
  };

  const filteredFields = getFilteredFields();
  const missingCount = fields.filter((f) => !f.value || f.value.trim() === "").length;
  const lowConfidenceCount = fields.filter(
    (f) => f.confidence === "low" || f.confidence === "medium"
  ).length;
  const requiredMissing = fields.filter(
    (f) => f.required && (!f.value || f.value.trim() === "")
  ).length;
  const approvedCount = fields.filter((f) => f.approved).length;
  const validatedCount = fields.filter(
    (f) => f.value && f.value.trim() !== "" && f.confidence === "high"
  ).length;

  const canSubmit = requiredMissing === 0;

  if (!document) {
    return <div className="p-6">Document not found</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Review Workbench</h1>
              <p className="text-sm text-slate-600">{document.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLayoutSwapped(!layoutSwapped)}
              title="Swap layout"
            >
              <ArrowLeftRight size={18} />
              Swap Layout
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleSaveDraft}>
              <Save size={18} />
              Save Draft
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setShowExportDialog(true)}>
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-slate-700">
              <strong>{approvedCount}</strong> / {fields.length} approved
            </span>
          </div>
          {missingCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-slate-700">
                <strong>{missingCount}</strong> missing ({requiredMissing} required)
              </span>
            </div>
          )}
          {lowConfidenceCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-slate-700">
                <strong>{lowConfidenceCount}</strong> need review
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fields Panel */}
        <div
          className={`w-1/2 bg-white border-slate-200 flex flex-col ${
            layoutSwapped ? "border-l order-2" : "border-r order-1"
          }`}
        >
          {/* Filter Tabs */}
          <div className="border-b border-slate-200 p-4 pb-0">
            <Tabs value={filterView} onValueChange={(v: any) => setFilterView(v)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="gap-2">
                  Extracted Fields
                  <Badge variant="secondary" className="ml-1">
                    {fields.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="missing" className="gap-2 pointer-events-none opacity-60">
                  Missing Fields
                  {missingCount > 0 && (
                    <Badge variant="destructive" className="ml-1">
                      {missingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="low-confidence" className="gap-2 pointer-events-none opacity-60">
                  Need Review
                  {lowConfidenceCount > 0 && (
                    <Badge className="ml-1 bg-amber-600">
                      {lowConfidenceCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Approve All Button */}
            <div className="py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleApproveAll}
                className="gap-2 w-full"
              >
                <CheckCircle2 size={16} />
                {fields.every((f) => f.approved) ? "Unapprove All" : "Approve All"}
              </Button>
            </div>
          </div>

          {/* Fields List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredFields.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                  <p className="font-medium text-slate-900">All fields validated!</p>
                  <p className="text-sm text-slate-600 mt-1">
                    No {filterView === "missing" ? "missing" : "low confidence"} fields found
                  </p>
                </div>
              ) : (
                filteredFields.map((field) => (
                  <FieldEditor
                    key={field.id}
                    field={field}
                    onUpdate={handleFieldUpdate}
                    onApprove={handleFieldApprove}
                    onSelect={setSelectedFieldId}
                    isSelected={selectedFieldId === field.id}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Selected Field Evidence */}
          {selectedField && selectedField.evidence && selectedField.evidence.length > 0 && (
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <h3 className="font-medium text-slate-900 mb-2 text-sm">Evidence Details</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="text-xs text-slate-600 mb-2">
                  Extracted from page {selectedField.evidence[0].pageNumber}
                </div>
                <div className="bg-slate-100 p-2 rounded text-sm font-mono">
                  "{selectedField.evidence[0].extractedText}"
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Position: ({selectedField.evidence[0].boundingBox.x},{" "}
                  {selectedField.evidence[0].boundingBox.y})
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Viewer */}
        <div
          className={`w-1/2 p-4 ${layoutSwapped ? "order-1" : "order-2"}`}
        >
          <DocumentViewer
            documentName={document.name}
            pageCount={document.pageCount}
            highlightedArea={
              selectedField?.evidence?.[0]
                ? selectedField.evidence[0].boundingBox
                : null
            }
          />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit to MMS?</DialogTitle>
            <DialogDescription>
              This will validate and submit the extracted data to the MMS/ERP system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700">Total Fields</span>
              <Badge variant="secondary">{fields.length}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-slate-700">Approved</span>
              <Badge className="bg-green-600">{approvedCount}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-slate-700">Edited by User</span>
              <Badge className="bg-blue-600">
                {fields.filter((f) => f.edited).length}
              </Badge>
            </div>
            {requiredMissing > 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-sm text-red-700">
                  <strong>{requiredMissing}</strong> required field(s) still missing
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
              className="bg-[#111111] hover:bg-black"
            >
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        documentName={document.name}
      />
    </div>
  );
}