import { useState } from "react";
import { DocumentField } from "../../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface ExtractedFieldsTableProps {
  fields: DocumentField[];
  itemsPerPage?: number;
}

export function ExtractedFieldsTable({ fields, itemsPerPage = 8 }: ExtractedFieldsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(fields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFields = fields.slice(startIndex, endIndex);

  const getConfidenceBadgeColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusBadgeColor = (value: string) => {
    if (value === "") return "bg-slate-100 text-slate-700";
    return "bg-blue-100 text-blue-800";
  };

  const getPaginationItems = () => {
    const items = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      if (currentPage > 3) items.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!items.includes(i)) items.push(i);
      }
      
      if (currentPage < totalPages - 2) items.push("...");
      items.push(totalPages);
    }
    
    return items;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Extracted Fields ({fields.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900 w-1/4">Field Name</TableHead>
                <TableHead className="font-semibold text-slate-900 w-1/3">Value</TableHead>
                <TableHead className="font-semibold text-slate-900 w-1/6">Confidence</TableHead>
                <TableHead className="font-semibold text-slate-900 w-1/6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFields.map((field) => (
                <TableRow key={field.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    {field.label}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {field.value ? (
                      <span>{field.value}</span>
                    ) : (
                      <span className="text-slate-500 italic">Not extracted</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getConfidenceBadgeColor(field.confidence)} capitalize text-xs`}
                    >
                      {field.confidence} ({field.confidenceScore}%)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusBadgeColor(field.value)} text-xs`}
                    >
                      {field.value ? "Extracted" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPaginationItems().map((pageNum, idx) => (
                  <PaginationItem key={idx}>
                    {pageNum === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum as number)}
                        isActive={currentPage === pageNum}
                        className={currentPage === pageNum ? "bg-[#111111] text-white" : "cursor-pointer"}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <div className="text-xs text-slate-600 text-center">
          Showing {startIndex + 1} to {Math.min(endIndex, fields.length)} of {fields.length} fields
        </div>
      </CardContent>
    </Card>
  );
}
