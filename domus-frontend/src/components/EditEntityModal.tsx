// src/components/EditEntityModal.tsx
import { useState, useEffect } from "react";
import { Button } from "../ui-components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui-components/card";
import { Input } from "../ui-components/input";

interface EditEntityModalProps {
  open: boolean;
  title: string;
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  showDurationInMonths?: boolean;
}

export function EditEntityModal({
  open,
  title,
  initialData,
  onSave,
  onCancel,
  showDurationInMonths = false,
}: EditEntityModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: initialData.value,
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
          />

          <Input
            type="number"
            value={formData.amount || ""}
            onChange={(e) =>
              handleChange("amount", Number(e.target.value))
            }
            placeholder="Amount"
          />

          <Input
            type="date"
            value={formData.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />

          {showDurationInMonths && (
            <Input
              type="number"
              min={1}
              value={formData.durationInMonths || ""}
              onChange={(e) =>
                handleChange(
                  "durationInMonths",
                  Number(e.target.value)
                )
              }
              placeholder="Duration (months)"
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              className="cursor-pointer"
            >
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
