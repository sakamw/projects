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
import { useToast } from "../../components/ui/toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await api.forgotPasswordApi({ email });
      const msg = res.message || "If that email exists, we sent a reset link.";
      setMessage(msg);
      showToast("If the email exists, a reset link has been sent.", {
        variant: "success",
      });
    } catch (err: unknown) {
      const friendly = (err as Error)?.message || "Something went wrong.";
      setError(friendly);
      showToast(friendly, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-white">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your registered email. We will send you a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3" role="status">
                {message}
              </div>
            )}
            <Button type="submit" disabled={loading || !email} className="w-full">
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
          <div className="mt-4 text-sm">
            Remembered your password?{" "}
            <button
              className="text-primary underline"
              onClick={() => navigate("/login")}
            >
              Back to sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


