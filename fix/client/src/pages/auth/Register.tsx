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

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    username.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await api.registerApi({
        firstName,
        lastName,
        email,
        username,
        password,
      });
      setSuccess(
        res.message ||
          "Registration successful. Check your email to activate your account."
      );
      showToast(
        "Registration successful! Please activate your account via email.",
        {
          variant: "success",
          durationMs: 3500,
        }
      );
      // Redirect to activation instructions page with email in query
      window.setTimeout(() => {
        const q = new URLSearchParams({ email }).toString();
        navigate(`/activate-instructions?${q}`, { replace: true });
      }, 800);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.message || "We couldn't create your account. Please try again.";
      setError(message);
      showToast(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Create your account to get started. All fields are required — use a
            strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
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
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  autoComplete="new-password"
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
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
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
            {success && (
              <div className="text-sm text-green-600" role="status">
                {success}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="w-full"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="mt-4 text-sm">
            Already have an account?{" "}
            <button
              className="text-primary underline"
              onClick={() => navigate("/login")}
            >
              Sign in
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
