import React, { useState } from "react";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login({ email, password });
      navigate("/dashboard");
    } catch {
      alert("Login falhou!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1C2D] via-[#0E2A47] to-[#123A63] relative overflow-hidden">
      
      {/* shapes de fundo (estilo do print) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-sm bg-[#0F2A44]/90 backdrop-blur shadow-2xl border border-white/10">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-white">
            Login
          </CardTitle>

          <CardDescription className="text-slate-300 text-sm">
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
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
                placeholder="Digite sua senha"
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

            {/* REGISTER */}
            <div className="text-center text-sm text-slate-300">
              Não tem conta?{" "}
              <span
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Cadastre-se
              </span>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Login
            </Button>

            {/* FORGOT PASSWORD */}
            <div className="text-center text-sm">
              <span
                className="text-slate-400 hover:text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Esqueci minha senha
              </span>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
