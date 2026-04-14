import { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface DocumentViewerProps {
  documentName: string;
  pageCount: number;
  highlightedArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export function DocumentViewer({
  documentName,
  pageCount,
  highlightedArea,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const highlightRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  // Calculate scaled position and size for highlights
  // Bounding box coordinates are at 100% scale relative to page container
  const getScaledHighlight = () => {
    if (!highlightedArea) return null;

    const scale = zoom / 100;
    return {
      left: highlightedArea.x * scale,
      top: highlightedArea.y * scale,
      width: highlightedArea.width * scale,
      height: highlightedArea.height * scale,
    };
  };

  // Auto-scroll to highlighted area when it changes
  useEffect(() => {
    if (highlightedArea && highlightRef.current && scrollContainerRef.current) {
      const highlight = highlightRef.current;
      const container = scrollContainerRef.current;

      // Calculate the position to scroll to (center the highlight)
      const scrollTop = highlight.offsetTop - container.clientHeight / 2 + highlight.clientHeight / 2;
      const scrollLeft = highlight.offsetLeft - container.clientWidth / 2 + highlight.clientWidth / 2;

      container.scrollTo({
        top: Math.max(0, scrollTop),
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, [highlightedArea]);

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-lg">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-slate-900 text-sm truncate max-w-xs">
              {documentName}
            </h3>
            <Badge variant="secondary" className="text-xs">
              PDF
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
              <ZoomOut size={16} />
            </Button>
            <span className="text-sm font-medium text-slate-700 min-w-[4rem] text-center">
              {zoom}%
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
              <ZoomIn size={16} />
            </Button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <RotateCw size={16} />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Document Display Area - Vertical Scroll */}
      <div className="flex-1 overflow-auto p-6" ref={scrollContainerRef}>
        <div className="space-y-4">
          {/* Render all pages vertically */}
          {Array.from({ length: pageCount }).map((_, index) => (
            <div
              key={index}
              className="mx-auto bg-white shadow-lg relative"
              style={{
                width: `${(612 * zoom) / 100}px`,
                height: `${(792 * zoom) / 100}px`,
              }}
            >
              {/* Mock Document Content */}
              <div className="w-full h-full p-8 text-slate-800" style={{ fontSize: `${(14 * zoom) / 100}px` }}>
                {/* Header */}
                <div className="border-b border-slate-300 pb-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 mb-1">DELIVERY NOTE</h1>
                      <p className="text-slate-600">Global Logistics Ltd</p>
                      <p className="text-slate-600">456 Commerce Street, Suite 200</p>
                      <p className="text-slate-600">Chicago, IL 60601</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">DN-2024-Q1-045</p>
                      <p className="text-slate-600 mt-1">Date: March 20, 2024</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="mb-6">
                  <h2 className="font-semibold mb-2">Ship To:</h2>
                  <p>Acme Manufacturing Inc.</p>
                  <p>1234 Industrial Parkway, Suite 500</p>
                  <p>Houston, TX 77001</p>
                </div>

                {/* Items Table */}
                <table className="w-full border border-slate-300 mb-6">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 text-left">Item</th>
                      <th className="border border-slate-300 p-2 text-left">Description</th>
                      <th className="border border-slate-300 p-2 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2">SKU-001</td>
                      <td className="border border-slate-300 p-2">Industrial Bearings</td>
                      <td className="border border-slate-300 p-2 text-right">250</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2">SKU-002</td>
                      <td className="border border-slate-300 p-2">Mounting Hardware</td>
                      <td className="border border-slate-300 p-2 text-right">500</td>
                    </tr>
                  </tbody>
                </table>

                {/* Signature Section */}
                <div className="mt-12 pt-6 border-t border-slate-300">
                  <p className="text-slate-600">Authorized Signature: ________________</p>
                  <p className="text-slate-600 mt-2">Date: ________________</p>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                  Page {index + 1} of {pageCount}
                </div>
              </div>

              {/* Highlighted Area Overlay - Only show on first page for now */}
              {index === 0 && highlightedArea && (() => {
                const scaledHighlight = getScaledHighlight();
                return scaledHighlight ? (
                  <div
                    ref={highlightRef}
                    className="absolute border-2 border-yellow-500 bg-yellow-200/40 pointer-events-none transition-all duration-300 ease-in-out"
                    style={{
                      left: `${scaledHighlight.left}px`,
                      top: `${scaledHighlight.top}px`,
                      width: `${scaledHighlight.width}px`,
                      height: `${scaledHighlight.height}px`,
                      boxShadow: "0 0 0 2px rgba(234, 179, 8, 0.3)",
                    }}
                  />
                ) : null;
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
