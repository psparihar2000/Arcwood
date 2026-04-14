import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, File, X, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { ExtractedFieldsTable } from "../components/ExtractedFieldsTable";
import { mockFields } from "../../data/mockData";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

type UploadStep = "customer" | "files" | "metadata" | "review";

export function UploadPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<UploadStep>("customer");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: "complete" as const } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 300);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleNextStep = () => {
    if (currentStep === "customer" && customer) {
      setCurrentStep("files");
    } else if (currentStep === "files" && files.length > 0 && files.every((f) => f.status === "complete")) {
      setCurrentStep("metadata");
    } else if (currentStep === "metadata" && wasteType && documentType) {
      setCurrentStep("review");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "files") {
      setCurrentStep("customer");
    } else if (currentStep === "metadata") {
      setCurrentStep("files");
    } else if (currentStep === "review") {
      setCurrentStep("metadata");
    }
  };

  const handleSubmit = () => {
    navigate("/submission-success", {
      state: {
        customer,
        fileCount: files.length,
        documentType,
        wasteType,
      },
    });
  };

  const allFilesComplete = files.length > 0 && files.every((f) => f.status === "complete");

  const stepIndicator = (
    <div className="flex items-center gap-2 mb-6">
      {(['customer', 'files', 'metadata', 'review'] as const).map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentStep === step
                ? 'bg-[#111111] text-white'
                : ['customer', 'files', 'metadata'].includes(currentStep) && ['customer', 'files', 'metadata', 'review'].indexOf(step) < ['customer', 'files', 'metadata', 'review'].indexOf(currentStep)
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {index + 1}
          </div>
          {index < 3 && <div className="h-0.5 w-8 bg-slate-200" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Upload Documents</h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload customer documents for AI-assisted extraction and validation
        </p>
      </div>

      {stepIndicator}

      {/* Step 1: Customer Selection */}
      {currentStep === "customer" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="customer">Customer Name</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger id="customer" className="mt-2">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Manufacturing Inc.</SelectItem>
                  <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                  <SelectItem value="global">Global Logistics Ltd</SelectItem>
                  <SelectItem value="enterprise">Enterprise Systems Corp</SelectItem>
                  <SelectItem value="buildright">BuildRight Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!customer}
                className="w-full bg-[#111111] hover:bg-black flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: File Upload */}
      {currentStep === "files" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Files for {customer === "acme" ? "Acme Manufacturing Inc." : customer === "techcorp" ? "TechCorp Solutions" : customer === "global" ? "Global Logistics Ltd" : customer === "enterprise" ? "Enterprise Systems Corp" : "BuildRight Construction"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive
                  ? "border-[#111111] bg-slate-100"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Upload size={28} className="text-slate-900" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">
                Drag and drop files here
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                or click to browse from your computer
              </p>
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileInput}
                className="hidden"
              />
              <label htmlFor="fileInput">
                <Button type="button" variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-slate-500 mt-4">
                Supported formats: PDF, DOC, DOCX, PNG, JPG (max 25MB)
              </p>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900">{files.length} File(s) Selected</h3>
                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <File size={20} className="text-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-slate-900 truncate">
                          {uploadFile.file.name}
                        </p>
                        {uploadFile.status === "complete" && (
                          <CheckCircle2 size={18} className="text-green-600" />
                        )}
                        {uploadFile.status === "error" && (
                          <AlertCircle size={18} className="text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadFile.status === "uploading" && (
                        <Progress value={uploadFile.progress} className="h-1.5" />
                      )}
                      {uploadFile.status === "complete" && (
                        <p className="text-xs text-green-600">Upload complete</p>
                      )}
                      {uploadFile.status === "error" && (
                        <p className="text-xs text-red-600">{uploadFile.error}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(uploadFile.id)}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!allFilesComplete}
                className="w-full bg-[#111111] hover:bg-black flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Metadata */}
      {currentStep === "metadata" && (
        <Card>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wasteType">Waste Type</Label>
              <Select value={wasteType} onValueChange={setWasteType}>
                <SelectTrigger id="wasteType" className="mt-1.5">
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                  <SelectItem value="non-hazardous">Non-hazardous</SelectItem>
                  <SelectItem value="recyclable">Recyclable</SelectItem>
                  <SelectItem value="non-recyclable">Non-recyclable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="documentType" className="mt-1.5">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sds">Safety Data Sheet (SDS)</SelectItem>
                  <SelectItem value="lab-analysis">Lab Analysis Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any relevant notes..."
                className="mt-1.5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!wasteType || !documentType}
                className="w-full bg-[#111111] hover:bg-black flex items-center justify-center gap-2"
              >
                Review <ChevronRight size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review Extracted Fields */}
      {currentStep === "review" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submission Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Customer</p>
                  <p className="font-medium text-slate-900">
                    {customer === "acme" ? "Acme Manufacturing Inc." : customer === "techcorp" ? "TechCorp Solutions" : customer === "global" ? "Global Logistics Ltd" : customer === "enterprise" ? "Enterprise Systems Corp" : "BuildRight Construction"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Files</p>
                  <p className="font-medium text-slate-900">{files.length} file(s)</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Waste Type</p>
                  <p className="font-medium text-slate-900 capitalize">{wasteType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Document Type</p>
                  <p className="font-medium text-slate-900">{documentType === "sds" ? "Safety Data Sheet (SDS)" : "Lab Analysis Report"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Extracted Fields Preview</h2>
            <ExtractedFieldsTable fields={mockFields} />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handlePrevStep}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full bg-[#111111] hover:bg-black"
            >
              Submit & Complete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
