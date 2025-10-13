import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ActivateAccount() {
  const { id = "", token = "" } = useParams();

  useEffect(() => {
    if (!id || !token) return;
    const apiBase =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((import.meta as any).env?.VITE_API_URL as string) ||
      "http://localhost:4300/api";
    window.location.href = `${apiBase}/auth/activate/${encodeURIComponent(
      id
    )}/${encodeURIComponent(token)}`;
  }, [id, token]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-white">
      <div className="text-sm text-muted-foreground">
        Activating your account...
      </div>
    </div>
  );
}
