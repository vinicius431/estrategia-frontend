import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("Resposta inválida do servidor.");
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("planoAtivo", data.usuario.plano);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        setMensagem("✅ Login realizado com sucesso!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMensagem("❌ " + (data?.erro || "Erro desconhecido."));
      }
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1118] to-[#0d1b25] text-white font-sans">
      <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md border border-blue-600">
        <img src="/logo.png" alt="Logo EstrategIA" className="mx-auto mb-6 w-32 h-auto" />

        <p className="text-sm text-center text-gray-600 mb-6">
          Faça login na sua conta para continuar
        </p>

        {mensagem && (
          <div className="bg-blue-100 text-blue-800 p-3 rounded text-sm mb-4">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          Ainda não tem uma conta?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Crie agora
          </a>
        </div>
      </div>

      {/* Rodapé com links legais */}
      <div className="mt-6 text-xs text-center text-gray-400">
        <a href="/politica" className="mx-1 hover:underline hover:text-blue-600">
          Política de Privacidade
        </a>
        •
        <a href="/termos" className="mx-1 hover:underline hover:text-blue-600">
          Termos de Uso
        </a>
        •
        <a href="/exclusao" className="mx-1 hover:underline hover:text-blue-600">
          Exclusão de Dados
        </a>
      </div>

      {/* Rodapé institucional */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p className="font-medium">E-mails institucionais:</p>
        <p>
          contato@appestrategia.com • suporte@appestrategia.com • atendimento@appestrategia.com
        </p>
        <p className="mt-1">CNPJ: 43.340.858/0001-08</p>
        <p className="mt-1">© {new Date().getFullYear()} EstrategIA — Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
