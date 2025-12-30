import { useState, useEffect } from "react";
import { Button } from "../ui-components/button";
import { Input } from "../ui-components/input";
import { Label } from "../ui-components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui-components/select";
import { Textarea } from "../ui-components/textArea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui-components/card";

interface EditEntityModalProps {
  open: boolean;
  title: string;
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  showDurationInMonths?: boolean;
  showExpenseCategories?: boolean;
  showFieldsImvestments?: boolean;
}

export function EditEntityModal({
  open,
  title,
  initialData,
  onSave,
  onCancel,
  showDurationInMonths = false,
  showExpenseCategories = false,
  showFieldsImvestments = false,
}: EditEntityModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      ...initialData,
      amount: initialData.value ?? initialData.amount,
    });
  }, [initialData]);

  if (!open) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      amount: Number(formData.amount),
      durationInMonths: showDurationInMonths
        ? Number(formData.durationInMonths)
        : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-xl shadow-2xl">
        {/* HEADER */}
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-6 pt-6">
          {/* AMOUNT + DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY + FREQUENCY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                {showExpenseCategories ? (
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Food & Dining">
                      Food & Dining
                    </SelectItem>
                    <SelectItem className="select-item" value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem className="select-item" value="Shopping">
                      Shopping
                    </SelectItem>
                    <SelectItem className="select-item" value="Entertainment">
                      Entertainment
                    </SelectItem>
                    <SelectItem
                      className="select-item"
                      value="Bills & Utilities"
                    >
                      Bills & Utilities
                    </SelectItem>
                    <SelectItem className="select-item" value="Healthcare">
                      Healthcare
                    </SelectItem>
                    <SelectItem className="select-item" value="Education">
                      Education
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                ) : (
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Salary">
                      Salary
                    </SelectItem>
                    <SelectItem className="select-item" value="Freelance">
                      Freelance
                    </SelectItem>
                    <SelectItem className="select-item" value="Bonus">
                      Bonus
                    </SelectItem>
                    <SelectItem className="select-item" value="Investment">
                      Investment
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                )}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(v) => handleChange("frequency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="select-item" value="One-time">
                    One-time
                  </SelectItem>
                  <SelectItem className="select-item" value="Monthly">
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* DURATION (ONLY EXPENSES) */}
          {showDurationInMonths && (
            <div className="space-y-2">
              <Label>Duration (months)</Label>
              <Input
                type="number"
                min={1}
                value={formData.durationInMonths || ""}
                onChange={(e) =>
                  handleChange("durationInMonths", e.target.value)
                }
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Investment Type</Label>
              <Select
                value={formData.investmenteType}
                onValueChange={(v) => handleChange("investmenteType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                {showFieldsImvestments && (
                  <SelectContent className="select-content">
                    <SelectItem className="select-item" value="Food & Dining">
                      Food & Dining
                    </SelectItem>
                    <SelectItem className="select-item" value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem className="select-item" value="Shopping">
                      Shopping
                    </SelectItem>
                    <SelectItem className="select-item" value="Entertainment">
                      Entertainment
                    </SelectItem>
                    <SelectItem
                      className="select-item"
                      value="Bills & Utilities"
                    >
                      Bills & Utilities
                    </SelectItem>
                    <SelectItem className="select-item" value="Healthcare">
                      Healthcare
                    </SelectItem>
                    <SelectItem className="select-item" value="Education">
                      Education
                    </SelectItem>
                    <SelectItem className="select-item" value="Other">
                      Other
                    </SelectItem>
                  </SelectContent>
                )}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(v) => handleChange("frequency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="select-item" value="One-time">
                    One-time
                  </SelectItem>
                  <SelectItem className="select-item" value="Monthly">
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-5 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              className="cursor-pointer"
              style={{
                background: "var(--financial-income)",
                color: "white",
              }}
            >
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
