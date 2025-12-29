import { Button } from "../ui-components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui-components/card";

interface DeleteConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        {/* HEADER */}
        <CardHeader
          className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <CardTitle className="text-lg font-semibold text-red-500">
            {title}
          </CardTitle>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-4 pt-5">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>

          {/* ACTIONS */}
          <div
            className="flex justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-5 h-10 text-sm cursor-pointer hover:opacity-70"
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              className="px-6 h-10 text-sm font-medium cursor-pointer hover:opacity-70"
              style={{
                background: "var(--destructive, #dc2626)",
                color: "white",
              }}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
