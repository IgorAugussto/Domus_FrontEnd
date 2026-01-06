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
  showFieldsInvestments?: boolean;
}

export function EditEntityModal({
  open,
  title,
  initialData,
  onSave,
  onCancel,
  showDurationInMonths = false,
  showExpenseCategories = false,
  showFieldsInvestments = false,
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
      expectedReturn: showFieldsInvestments
        ? Number(formData.expectedReturn)
        : undefined,
        typeInvestments: showFieldsInvestments
      ? formData.typeInvestments
      : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-xl shadow-2xl">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* AMOUNT + START DATE */}
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
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
          </div>

          {/* INVESTMENTS ONLY */}
          {showFieldsInvestments && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Investment Type</Label>
                  <Select
                    value={formData.typeInvestments}
                    onValueChange={(v) =>
                      handleChange("typeInvestments", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="select-item" value="ETF">ETF</SelectItem>
                      <SelectItem className="select-item" value="Stocks">Stocks</SelectItem>
                      <SelectItem className="select-item" value="Crypto">Crypto</SelectItem>
                      <SelectItem className="select-item" value="Fixed Income">Fixed Income</SelectItem>
                      <SelectItem className="select-item" value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expected Return (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.expectedReturn || ""}
                    onChange={(e) =>
                      handleChange("expectedReturn", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </>
          )}

          {/* CATEGORY + FREQUENCY (NOT INVESTMENTS) */}
          {!showFieldsInvestments && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  {showExpenseCategories ? (
                    <SelectContent>
                      <SelectItem value="Food & Dining">
                        Food & Dining
                      </SelectItem>
                      <SelectItem value="Transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="Bills & Utilities">
                        Bills & Utilities
                      </SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  ) : (
                    <SelectContent>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Bonus">Bonus</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One-time">One-time</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* DURATION (EXPENSES ONLY) */}
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
