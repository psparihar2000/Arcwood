import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, FileText, User, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface SubmissionState {
  customer: string;
  fileCount: number;
  documentType: string;
  wasteType: string;
}

export function SubmissionSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SubmissionState || {
    customer: "Unknown",
    fileCount: 0,
    documentType: "Unknown",
    wasteType: "Unknown",
  };

  const getCustomerDisplayName = (customer: string) => {
    const customerMap: Record<string, string> = {
      acme: "Acme Manufacturing Inc.",
      techcorp: "TechCorp Solutions",
      global: "Global Logistics Ltd",
      enterprise: "Enterprise Systems Corp",
      buildright: "BuildRight Construction",
    };
    return customerMap[customer] || customer;
  };

  const getDocumentTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      sds: "Safety Data Sheet (SDS)",
      "lab-analysis": "Lab Analysis Report",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Submission Successful!</h1>
          <p className="text-lg text-slate-600">
            Your documents have been successfully submitted for processing
          </p>
        </div>

        {/* Submission Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Customer</p>
                  <p className="font-semibold text-slate-900">{getCustomerDisplayName(state.customer)}</p>
                </div>
              </div>

              {/* Files Count */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Files Submitted</p>
                  <p className="font-semibold text-slate-900">{state.fileCount} file(s)</p>
                </div>
              </div>

              {/* Document Type */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Document Type</p>
                  <p className="font-semibold text-slate-900">{getDocumentTypeDisplayName(state.documentType)}</p>
                </div>
              </div>

              {/* Waste Type */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Zap size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Waste Type</p>
                  <p className="font-semibold text-slate-900 capitalize">{state.wasteType}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card>
          <CardHeader>
            <CardTitle>What Happens Next</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900">Document Processing</p>
                  <p className="text-sm text-slate-600">Your documents are being analyzed using AI to extract all relevant fields</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900">Field Extraction & Validation</p>
                  <p className="text-sm text-slate-600">Extracted fields will be validated against confidence scores and business rules</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-900">Review & Approval</p>
                  <p className="text-sm text-slate-600">The results will be available in the Documents section for your review</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium text-slate-900">Data Integration</p>
                  <p className="text-sm text-slate-600">Once approved, your data will be sent to the MMS system</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/upload")}
          >
            Upload More Documents
          </Button>
          <Button
            onClick={() => navigate("/documents")}
            className="w-full bg-[#111111] hover:bg-black"
          >
            View in Documents Section
          </Button>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
