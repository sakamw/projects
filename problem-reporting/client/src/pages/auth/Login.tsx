import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { api } from "../../lib/api";
import { useSessionStore } from "../../stores/session";
import { useToast } from "../../components/ui/toast";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useSessionStore((s) => s.setSession);
  const { showToast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValid = identifier.trim().length > 0 && password.trim().length > 0;
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await api.loginApi({ identifier, password });
      // Cookie holds token; we just store user for client state
      setSession(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.isAdmin ? "admin" : "student",
        },
        "cookie"
      );
      // Show success toast and redirect after a short delay
      showToast("Login successful! Redirecting...", {
        variant: "success",
        durationMs: 2000,
      });
      window.setTimeout(() => {
        const target = user.isAdmin ? "/admin" : "/dashboard";
        navigate(target, { replace: true });
        showToast(`Welcome back, ${user.firstName}!`, {
          variant: "info",
          durationMs: 2500,
        });
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.message || "We couldn't sign you in. Please try again.";
      setError(message);
      showToast(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <Card className="w-full max-w-lg min-h-[420px]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to continue where you left off. Use your email or username.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium">
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-md border bg-background px-4 py-3 pr-10 outline-none focus:ring-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 my-auto text-sm text-gray-600"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary underline"
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <button
              className="text-primary underline"
              onClick={() => navigate("/register")}
            >
              Create one
            </button>
            <div className="mt-4 text-sm">
              <button
                className="text-primary underline"
                onClick={() => navigate("/")}
              >
                ↶ Back to Home
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
