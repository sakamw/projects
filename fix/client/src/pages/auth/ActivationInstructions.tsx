import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../components/ui/toast";
import { api } from "../../lib/api";

export default function ActivationInstructions() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const em = params.get("email") || "";
    setEmail(em);
  }, [params]);

  async function handleResend() {
    if (!email) {
      showToast("Missing email. Please register again.", { variant: "error" });
      return;
    }
    setLoading(true);
    try {
      await api.resendActivationApi({ email });
      showToast("Activation email resent. Check your inbox.", {
        variant: "success",
      });
    } catch (e: unknown) {
      const msg = (e as Error)?.message || "Failed to resend activation email.";
      showToast(msg, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-white">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
          <CardTitle>Verify your email to activate your account</CardTitle>
          <CardDescription>
            We&apos;ve sent an activation link to{" "}
            {email ? (
              <span className="font-medium">{email}</span>
            ) : (
              "your email"
            )}
            . Click the link in the email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <ul className="list-disc space-y-2 pl-5">
              <li>It can take up to a few minutes for the email to arrive.</li>
              <li>Check your spam or junk folder if you don&apos;t see it.</li>
              <li>
                The link expires in 24 hours; you can request a new one anytime.
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={handleResend} disabled={loading}>
                {loading ? "Resending..." : "Resend activation email"}
              </Button>
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Back to login
              </Button>
              <Button variant="secondary" onClick={() => navigate("/")} className="text-primary underline">
                Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
