import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { DocumentField } from "../../data/mockData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FieldEditorProps {
  field: DocumentField;
  onUpdate: (fieldId: string, value: string) => void;
  onApprove: (fieldId: string) => void;
  onSelect: (fieldId: string) => void;
  isSelected: boolean;
}

export function FieldEditor({
  field,
  onUpdate,
  onApprove,
  onSelect,
  isSelected,
}: FieldEditorProps) {
  const [value, setValue] = useState(field.value);

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onUpdate(field.id, newValue);
  };

  const isEmpty = !field.value || field.value.trim() === "";

  const getConfidenceColor = () => {
    if (field.confidence === "high") return "text-green-600";
    if (field.confidence === "medium") return "text-amber-600";
    return "text-red-600";
  };

  const getBorderColor = () => {
    if (isSelected) return "border-[#111111] ring-2 ring-[#111111]/20";
    if (isEmpty && field.required) return "border-red-300 bg-red-50/30";
    if (field.confidence === "low") return "border-amber-300 bg-amber-50/30";
    if (field.approved) return "border-green-300 bg-green-50/20";
    return "border-slate-200 bg-white";
  };

  return (
    <div
      onClick={() => onSelect(field.id)}
      className={`p-4 border rounded-lg transition-all cursor-pointer hover:border-slate-300 ${getBorderColor()}`}
    >
      {/* Field Label & Confidence */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-slate-900">{field.label}</h3>
            {field.required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Confidence Score */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">Confidence:</span>
              <span className={`text-xs font-semibold ${getConfidenceColor()}`}>
                {field.confidenceScore}%
              </span>
            </div>

            {/* Status Badges */}
            {field.edited && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Edited
              </Badge>
            )}
            {field.approved && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Approved
              </Badge>
            )}
            {isEmpty && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                Not Extracted
              </Badge>
            )}
          </div>
        </div>

        {/* Approval Checkmark */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={field.approved ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(field.id);
                }}
                className={`h-8 w-8 flex-shrink-0 ${
                  field.approved
                    ? "bg-green-600 hover:bg-green-700 border-green-600"
                    : "border-slate-300 hover:border-green-500 hover:bg-green-50"
                }`}
              >
                <Check size={16} className={field.approved ? "text-white" : "text-slate-400"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{field.approved ? "Approved" : "Click to approve"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Editable Value */}
      <div className="mb-3">
        {field.fieldType === "select" && field.options ? (
          <Select
            value={value}
            onValueChange={handleChange}
          >
            <SelectTrigger
              className="bg-slate-100 border-slate-200 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            type={
              field.fieldType === "number"
                ? "number"
                : field.fieldType === "date"
                ? "date"
                : "text"
            }
            placeholder={isEmpty ? "Not Extracted" : `Enter ${field.label.toLowerCase()}`}
            className={`bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400 ${
              isEmpty ? "border-red-200" : ""
            }`}
          />
        )}
      </div>

      {/* Historical Recommendations */}
      {field.historicalRecommendations && field.historicalRecommendations.length > 0 && (
        <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded">
          <div className="text-xs font-medium text-purple-900 mb-1">
            Suggestions
          </div>
          <div className="flex flex-wrap gap-1">
            {field.historicalRecommendations.map((rec, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(rec);
                }}
                className="px-2 py-0.5 bg-white border border-purple-300 rounded text-xs hover:bg-purple-100 transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Info */}
      {field.evidence && field.evidence.length > 0 && (
        <div className="text-xs text-slate-500">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help hover:text-slate-700">
                  📄 Page {field.evidence[0].pageNumber}
                  {field.evidence.length > 1 && ` (+${field.evidence.length - 1} more)`}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view source in document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Missing Value Warning */}
      {isEmpty && field.required && (
        <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
          <AlertCircle size={14} />
          <span>Required field - no value detected</span>
        </div>
      )}
    </div>
  );
}
