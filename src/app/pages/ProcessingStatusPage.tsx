import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FileText, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";

interface ProcessingStep {
  id: string;
  name: string;
  status: "pending" | "processing" | "complete" | "error";
  progress?: number;
  duration?: string;
}

export function ProcessingStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: "upload", name: "Upload Complete", status: "complete" },
    { id: "ocr", name: "OCR Text Extraction", status: "processing", progress: 0 },
    { id: "ai", name: "AI Field Detection", status: "pending" },
    { id: "confidence", name: "Confidence Scoring", status: "pending" },
    { id: "validation", name: "Data Validation", status: "pending" },
    { id: "ready", name: "Ready for Review", status: "pending" },
  ]);

  useEffect(() => {
    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 5, 100);
        
        // Update steps based on progress
        if (next > 20 && steps[1].status !== "complete") {
          updateStep(1, "complete");
          updateStep(2, "processing");
        }
        if (next > 40 && steps[2].status !== "complete") {
          updateStep(2, "complete");
          updateStep(3, "processing");
        }
        if (next > 60 && steps[3].status !== "complete") {
          updateStep(3, "complete");
          updateStep(4, "processing");
        }
        if (next > 80 && steps[4].status !== "complete") {
          updateStep(4, "complete");
          updateStep(5, "processing");
        }
        if (next >= 100 && steps[5].status !== "complete") {
          updateStep(5, "complete");
          setTimeout(() => {
            navigate(`/review/${id}`);
          }, 1500);
        }
        
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [steps, id, navigate]);

  const updateStep = (index: number, status: ProcessingStep["status"]) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, status } : step))
    );
    setCurrentStep(index);
  };

  const getStepIcon = (status: ProcessingStep["status"]) => {
    if (status === "complete") {
      return <CheckCircle2 size={20} className="text-green-600" />;
    }
    if (status === "processing") {
      return <Loader2 size={20} className="text-slate-900 animate-spin" />;
    }
    return <div className="w-5 h-5 rounded-full border-2 border-slate-300" />;
  };

  const getStepDuration = (index: number) => {
    const durations = ["0s", "2.3s", "3.1s", "1.8s", "2.5s", "0.9s"];
    return steps[index].status === "complete" ? durations[index] : "";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
          <FileText size={32} className="text-slate-900" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Processing Document</h1>
        <p className="text-sm text-slate-600 mt-2">
          delivery_note_2024_Q1.pdf
        </p>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Processing Progress</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Loader2 size={14} className="animate-spin" />
              In Progress
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-sm font-medium text-slate-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Processing Steps */}
          <div className="space-y-3 pt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  step.status === "processing"
                    ? "border-slate-300 bg-slate-100"
                    : step.status === "complete"
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${
                        step.status === "complete"
                          ? "text-slate-900"
                          : step.status === "processing"
                          ? "text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {step.name}
                    </h3>
                    {step.status === "complete" && (
                      <span className="text-xs text-slate-500">
                        {getStepDuration(index)}
                      </span>
                    )}
                  </div>
                  {step.status === "processing" && (
                    <p className="text-sm text-slate-700 mt-1">Processing...</p>
                  )}
                  {step.status === "complete" && (
                    <p className="text-sm text-green-700 mt-1">Complete</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Details */}
      <Card>
        <CardHeader>
          <CardTitle>Document Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Document Type</p>
              <p className="font-medium text-slate-900 mt-1">Delivery Note</p>
            </div>
            <div>
              <p className="text-slate-600">Customer</p>
              <p className="font-medium text-slate-900 mt-1">Global Logistics Ltd</p>
            </div>
            <div>
              <p className="text-slate-600">Pages</p>
              <p className="font-medium text-slate-900 mt-1">1 page</p>
            </div>
            <div>
              <p className="text-slate-600">File Size</p>
              <p className="font-medium text-slate-900 mt-1">890 KB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Message */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 bg-[#111111] rounded-full flex items-center justify-center">
            <span className="text-white text-xs">i</span>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-medium text-slate-900">What's happening?</p>
          <p className="text-slate-700 mt-1">
            Our AI is extracting text, identifying fields, and calculating confidence scores. 
            This typically takes 2-5 minutes depending on document complexity. You'll be 
            automatically redirected to the review workbench when complete.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate("/")}>
          Return to Dashboard
        </Button>
        <Button
          disabled={progress < 100}
          className="gap-2 bg-[#111111] hover:bg-black"
          onClick={() => navigate(`/review/${id}`)}
        >
          Continue to Review
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}