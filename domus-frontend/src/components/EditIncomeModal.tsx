import { useState } from "react";
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
import { incomeService } from "../service/incomeService";

interface Props {
  income: any;
  onClose: () => void;
  onSaved: () => void;
}

export function EditIncomeModal({ income, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState(income.value);
  const [category, setCategory] = useState(income.category);
  const [description, setDescription] = useState(income.description);
  const [date, setDate] = useState(income.startDate);
  const [frequency, setFrequency] = useState(income.frequency);

  const handleSave = async () => {
    await incomeService.update(income.id, {
      amount,
      description,
      category,
      frequency,
      startDate: date,
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-xl shadow-2xl">
        {/* HEADER */}
        <CardHeader
          className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <CardTitle className="text-xl font-semibold">Edit Income</CardTitle>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-6 pt-6">
          {/* AMOUNT + DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Amount</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Date</Label>
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
              <Label className="text-sm text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                  <SelectItem className="select-item" value="Gift">
                    Gift
                  </SelectItem>
                  <SelectItem className="select-item" value="Other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="select-item" value="One-time">
                    One-time
                  </SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          {/* ACTIONS */}
          <div
            className="flex justify-end gap-3 pt-5 border-t"
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
              onClick={handleSave}
              className="px-6 h-10 text-sm font-medium transition-opacity cursor-pointer hover:opacity-70"
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
