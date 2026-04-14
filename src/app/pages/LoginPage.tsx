import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Building2, Mail, Lock } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const handleSSOLogin = (provider: string) => {
    // Simulate SSO login
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Arcwood Pre-MMS Workbench
            </h1>
            <p className="text-sm text-slate-600">
              Sign in to access document review and validation
            </p>
          </div>

          {/* SSO Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => handleSSOLogin("microsoft")}
              variant="outline"
              className="w-full justify-start gap-3 h-11"
            >
              <div className="w-5 h-5 bg-[#111111] rounded flex items-center justify-center">
                <Building2 size={14} className="text-white" />
              </div>
              Continue with Microsoft SSO
            </Button>
            <Button
              onClick={() => handleSSOLogin("okta")}
              variant="outline"
              className="w-full justify-start gap-3 h-11"
            >
              <div className="w-5 h-5 bg-[#111111] rounded flex items-center justify-center">
                <Building2 size={14} className="text-white" />
              </div>
              Continue with Okta
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-500">
              Or sign in with email
            </span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <a href="#" className="text-slate-900 hover:text-slate-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full h-11 bg-[#111111] hover:bg-black">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-center text-slate-500 mt-6">
            Protected by enterprise-grade security. By signing in, you agree to our Terms of Service
            and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Need access?{" "}
          <a href="#" className="text-slate-900 hover:text-slate-700">
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  );
}