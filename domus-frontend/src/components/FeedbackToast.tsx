interface FeedbackToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function FeedbackToast({
  message,
  type = "success",
  onClose,
}: FeedbackToastProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto px-5 py-4 rounded-xl shadow-xl flex items-center gap-4 min-w-[280px]"
        style={{
          background:
            type === "success"
              ? "var(--financial-income-light)"
              : "var(--destructive-light, #FEF2F2)",

          color:
            type === "success"
              ? "var(--financial-income)"
              : "var(--destructive, #991B1B)",
        }}
      >
        <span className="text-sm font-medium text-center">{message}</span>

        <button
          onClick={onClose}
          className="ml-auto text-sm opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
