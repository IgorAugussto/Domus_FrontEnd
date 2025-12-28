import { Button } from "../ui-components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui-components/card";
import { incomeService } from "../service/incomeService";

interface Props {
  income: any;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteIncomeModal({
  income,
  onClose,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
    await incomeService.delete(income.id);
    onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        {/* HEADER */}
        <CardHeader
          className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <CardTitle className="text-lg font-semibold text-red-500">
            Delete income?
          </CardTitle>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-4 pt-5">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This income will be permanently
            removed.
          </p>

          {/* ACTIONS */}
          <div
            className="flex justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="px-5 h-10 text-sm cursor-pointer hover:opacity-70"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
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
