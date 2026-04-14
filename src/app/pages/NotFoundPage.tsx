import { Link } from "react-router";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex p-6 bg-slate-100 rounded-full mb-6">
          <FileQuestion size={64} className="text-slate-400" />
        </div>
        <h1 className="text-4xl font-semibold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-lg text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="gap-2 bg-[#111111] hover:bg-black">
            <Home size={18} />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}