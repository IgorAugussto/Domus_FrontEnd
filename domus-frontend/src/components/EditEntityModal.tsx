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
              <Label>Valor</Label>
              <Input
                type="number"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Início</Label>
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
                  <Label>Tipo de Investimento</Label>
                  <Select
                    value={formData.typeInvestments}
                    onValueChange={(v) => handleChange("typeInvestments", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment type" />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      <SelectItem className="select-item" value="Stocks">
                        Ações
                      </SelectItem>
                      <SelectItem className="select-item" value="Bonds">
                        Renda Fixa
                      </SelectItem>
                      <SelectItem className="select-item" value="Real Estate">
                        Imóveis
                      </SelectItem>
                      <SelectItem className="select-item" value="Crypto">
                        Criptomoedas
                      </SelectItem>
                      <SelectItem className="select-item" value="Mutual Funds">
                        Fundos de Investimento
                      </SelectItem>
                      <SelectItem className="select-item" value="ETF">
                        ETF
                      </SelectItem>
                      <SelectItem className="select-item" value="Savings">
                        Poupança
                      </SelectItem>
                      <SelectItem className="select-item" value="Other">
                        Outros
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rentabilidade Esperada (%)</Label>
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
                <Label>Data de Término</Label>
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
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  {showExpenseCategories ? (
                    <SelectContent>
                      <SelectItem className="select-item" value="Food & Dining">
                        Alimentação
                      </SelectItem>
                      <SelectItem
                        className="select-item"
                        value="Transportation"
                      >
                        Transporte
                      </SelectItem>
                      <SelectItem className="select-item" value="Shopping">
                        Compras
                      </SelectItem>
                      <SelectItem className="select-item" value="Entertainment">
                        Entretenimento
                      </SelectItem>
                      <SelectItem
                        className="select-item"
                        value="Bills & Utilities"
                      >
                        Contas e Serviços
                      </SelectItem>
                      <SelectItem className="select-item" value="Healthcare">
                        Saúde
                      </SelectItem>
                      <SelectItem className="select-item" value="Education">
                        Educação
                      </SelectItem>
                      <SelectItem className="select-item" value="Other">
                        Outro
                      </SelectItem>
                    </SelectContent>
                  ) : (
                    <SelectContent>
                      <SelectItem className="select-item" value="Salary">
                        Salário
                      </SelectItem>
                      <SelectItem className="select-item" value="Freelance">
                        Freelance
                      </SelectItem>
                      <SelectItem className="select-item" value="Bonus">
                        Bônus
                      </SelectItem>
                      <SelectItem className="select-item" value="Investment">
                        Investimento
                      </SelectItem>
                      <SelectItem className="select-item" value="Other">
                        Outro
                      </SelectItem>
                    </SelectContent>
                  )}
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frequência</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(v) => handleChange("frequency", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="select-item" value="One-time">
                      Único
                    </SelectItem>
                    <SelectItem className="select-item" value="Monthly">
                      Mensal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* DURATION (EXPENSES ONLY) */}
          {showDurationInMonths && (
            <div className="space-y-2">
              <Label>Duração (meses)</Label>
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
              Cancelar
            </Button>

            <Button
              onClick={handleSave}
              className="cursor-pointer"
              style={{
                background: "var(--financial-income)",
                color: "white",
              }}
            >
              Salvar alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
