import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { api } from "../../lib/api";
import { useToast } from "../../components/ui/toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id = "", token = "" } = useParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState<
    "verifying" | "valid" | "invalid" | "submitting"
  >("verifying");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await api.verifyResetTokenApi({ id, token });
        if (!active) return;
        setStatus("valid");
      } catch (err: unknown) {
        if (!active) return;
        setStatus("invalid");
        setError((err as Error)?.message || "Invalid or expired link.");
      }
    })();
    return () => {
      active = false;
    };
  }, [id, token]);

  const canSubmit =
    status === "valid" && password.length >= 6 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setStatus("submitting");
    try {
      await api.resetPasswordApi({ id, token, password });
      showToast("Password changed successfully. Please sign in.", {
        variant: "success",
      });
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to reset password.");
      showToast((err as Error)?.message || "Failed to reset password.", {
        variant: "error",
      });
      setStatus("valid");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            {status === "verifying" && "Verifying your reset link..."}
            {status === "invalid" && "This link is invalid or has expired."}
            {status === "valid" && "Enter and confirm your new password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status !== "invalid" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-md border bg-background px-4 py-3 pr-10 outline-none focus:ring-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 my-auto text-sm text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full rounded-md border bg-background px-4 py-3 pr-10 outline-none focus:ring-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 my-auto text-sm text-gray-600"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="text-xs text-red-600">
                    Passwords do not match.
                  </div>
                )}
              </div>
              {error && (
                <div className="text-sm text-red-600" role="alert">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={!canSubmit || status === "submitting"}
                className="w-full"
              >
                {status === "submitting" ? "Updating..." : "Update password"}
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
              <Button onClick={() => navigate("/forgot-password")}>
                Request new link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
