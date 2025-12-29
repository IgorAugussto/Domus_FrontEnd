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
import { useState, useEffect } from "react";

interface EditEntityModalProps {
  open: boolean;
  title: string;
  initialData: {
    value: number;
    category: string;
    description: string;
    startDate: string;
    frequency: string;
  };
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function EditEntityModal({
  open,
  title,
  initialData,
  onSave,
  onCancel,
}: EditEntityModalProps) {
  const [amount, setAmount] = useState(initialData.value);
  const [category, setCategory] = useState(initialData.category);
  const [description, setDescription] = useState(initialData.description);
  const [date, setDate] = useState(initialData.startDate);
  const [frequency, setFrequency] = useState(initialData.frequency);

  useEffect(() => {
    setAmount(initialData.value);
    setCategory(initialData.category);
    setDescription(initialData.description);
    setDate(initialData.startDate);
    setFrequency(initialData.frequency);
  }, [initialData]);

  if (!open) return null;

  const handleSave = async () => {
    await onSave({
      amount,
      category,
      description,
      startDate: date,
      frequency,
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
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY + FREQUENCY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Bonus">Bonus</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-time">One-time</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-5 border-t">
            <Button
              type="submit"
              className="cursor-pointer"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="cursor-pointer"
              onClick={handleSave}
              style={{ background: "var(--financial-income)", color: "white" }}
            >
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
