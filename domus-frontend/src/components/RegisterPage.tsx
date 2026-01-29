import React, { useState, useEffect } from "react";
import { Button } from "../ui-components/button";
import { Input } from "../ui-components/input";
import { Label } from "../ui-components/label";
import { authService } from "../service/authService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui-components/card";
import { useNavigate } from "react-router-dom";
import { FeedbackToast } from "./FeedbackToast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
      // Só redireciona DEPOIS que o toast sumir (melhor UX)
      if (toast.type === "success") {
        navigate("/login");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.register({
        name,
        email,
        password,
      });

      setToast({
        message: "Conta criada com sucesso! Faça login para entrar.",
        type: "success",
      });

      navigate("/login");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setToast({
          message:
            "Criação de contas desativada. Este ambiente está em modo demonstração.",
          type: "error",
        });
      } else {
        setToast({
          message: "Falha ao criar conta. Tente novamente.",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1C2D] via-[#0E2A47] to-[#123A63] relative overflow-hidden">
      {/* shapes de fundo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-sm bg-[#0F2A44]/90 backdrop-blur shadow-2xl border border-white/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-white">
            Criar conta
          </CardTitle>

          <CardDescription className="text-slate-300 text-sm">
            Preencha os dados para se cadastrar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* NAME */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-slate-200 text-sm">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#0B2238] border border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-200 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0B2238] border border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-200 text-sm">
                Senha
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0B2238] border border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>

            {/* SHOW PASSWORD */}
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="accent-blue-500"
              />
              <label htmlFor="showPassword">Mostrar senha</label>
            </div>

            {/* LOGIN LINK */}
            <div className="text-center text-sm text-slate-300">
              Já tem conta?{" "}
              <span
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Fazer login
              </span>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Criar conta
            </Button>
          </form>
        </CardContent>
      </Card>

      {toast && (
        <FeedbackToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
