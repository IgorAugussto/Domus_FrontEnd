import { useState, useEffect } from "react";
import { Button } from "../ui-components/button";
import { Input } from "../ui-components/input";
import { Label } from "../ui-components/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui-components/card";

interface SpendingGoalModalProps {
  open: boolean;
  currentGoal: number;
  onSave: (goal: number) => void;
  onCancel: () => void;
}

export function SpendingGoalModal({
  open,
  currentGoal,
  onSave,
  onCancel,
}: SpendingGoalModalProps) {
  const [goalValue, setGoalValue] = useState<string>("");

  useEffect(() => {
    if (open) {
      setGoalValue(currentGoal > 0 ? currentGoal.toString() : "");
    }
  }, [open, currentGoal]);

  if (!open) return null;

  const handleSave = () => {
    const value = Number(goalValue);
    if (value > 0) {
      onSave(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            Definir Meta de Gastos
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label>Meta de Gastos Mensal (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 5000.00"
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Uma linha será exibida no gráfico mostrando sua meta
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSave}
              className="cursor-pointer"
              style={{
                background: "var(--financial-income)",
                color: "white",
              }}
              disabled={!goalValue || Number(goalValue) <= 0}
            >
              Salvar Meta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}