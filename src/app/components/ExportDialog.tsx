import { useState } from "react";
import { Download, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
}

type ExportState = "idle" | "exporting" | "success" | "error";

export function ExportDialog({ open, onOpenChange, documentName }: ExportDialogProps) {
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleExport = async () => {
    setExportState("exporting");
    setProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate random success/failure
          const success = Math.random() > 0.3;
          if (success) {
            setExportState("success");
          } else {
            setExportState("error");
            setErrorMessage("Export failed: Network timeout. Your work has been preserved.");
          }
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleReset = () => {
    setExportState("idle");
    setProgress(0);
    setErrorMessage("");
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        {exportState === "idle" && (
          <>
            <DialogHeader>
              <DialogTitle>Export Document Data</DialogTitle>
              <DialogDescription>
                Export validated data in JSON or CSV format
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-900 mb-1">Document</p>
                <p className="text-sm text-slate-600">{documentName}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">Select Format</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 border-2 border-[#111111] bg-slate-100 rounded-lg text-left hover:bg-slate-200 transition-colors">
                    <p className="font-medium text-slate-900">JSON</p>
                    <p className="text-xs text-slate-700 mt-1">Machine-readable format</p>
                  </button>
                  <button className="p-4 border-2 border-slate-200 rounded-lg text-left hover:bg-slate-50 transition-colors">
                    <p className="font-medium text-slate-900">CSV</p>
                    <p className="text-xs text-slate-600 mt-1">Spreadsheet format</p>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleExport} className="gap-2 bg-[#111111] hover:bg-black">
                <Download size={16} />
                Export
              </Button>
            </DialogFooter>
          </>
        )}

        {exportState === "exporting" && (
          <>
            <DialogHeader>
              <DialogTitle>Exporting Document...</DialogTitle>
              <DialogDescription>Please wait while we prepare your export</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="flex items-center justify-center">
                <Loader2 size={48} className="text-slate-900 animate-spin" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Export Progress</span>
                  <span className="text-sm font-medium text-slate-900">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <p className="text-sm text-slate-600 text-center">
                Preparing data and generating export file...
              </p>
            </div>
          </>
        )}

        {exportState === "success" && (
          <>
            <DialogHeader>
              <DialogTitle>Export Complete!</DialogTitle>
              <DialogDescription>Your data has been successfully exported</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="flex items-center justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="font-medium text-slate-900">Export successful!</p>
                <p className="text-sm text-slate-600">{documentName}_export.json</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">File Size</span>
                  <Badge variant="secondary">24.8 KB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Fields Exported</span>
                  <Badge variant="secondary">24</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Format</span>
                  <Badge variant="secondary">JSON</Badge>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button className="gap-2 bg-[#111111] hover:bg-black">
                <Download size={16} />
                Download File
              </Button>
            </DialogFooter>
          </>
        )}

        {exportState === "error" && (
          <>
            <DialogHeader>
              <DialogTitle>Export Failed</DialogTitle>
              <DialogDescription>There was an error exporting your data</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="flex items-center justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <XCircle size={48} className="text-red-600" />
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900 mb-1">Error Details</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg">
                <p className="text-sm font-medium text-slate-900 mb-1">
                  Your work is safe
                </p>
                <p className="text-sm text-slate-700">
                  All your edits and validations have been preserved. You can retry the export
                  or save as a draft.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleReset} className="gap-2 bg-[#111111] hover:bg-black">
                Retry Export
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}