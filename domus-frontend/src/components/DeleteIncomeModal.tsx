import { Button } from "../ui-components/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui-components/card";
import { incomeService } from "../service/incomeService";

interface Props {
  income: any;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteIncomeModal({ income, onClose, onDeleted }: Props) {
  const handleDelete = async () => {
    await incomeService.delete(income.id);
    onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Delete income?</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
