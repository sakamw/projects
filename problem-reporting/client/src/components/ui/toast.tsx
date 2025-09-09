import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Toast = {
  id: number;
  message: string;
  variant?: "success" | "error" | "info";
  durationMs?: number;
};

type ToastContextValue = {
  showToast: (
    message: string,
    options?: { variant?: Toast["variant"]; durationMs?: number }
  ) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      options?: { variant?: Toast["variant"]; durationMs?: number }
    ) => {
      const toast: Toast = {
        id: Date.now() + Math.random(),
        message,
        variant: options?.variant ?? "info",
        durationMs: options?.durationMs ?? 3000,
      };
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.durationMs);
    },
    []
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex max-w-[90vw] flex-col gap-2 sm:max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              "rounded-md border px-4 py-3 shadow-lg",
              t.variant === "success" &&
                "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-900/40 dark:text-emerald-50",
              t.variant === "error" &&
                "border-red-300 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-900/40 dark:text-red-50",
              t.variant === "info" &&
                "border-slate-300 bg-white text-slate-900 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-50",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
