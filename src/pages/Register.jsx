import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  // Preenche os campos automaticamente para teste
  useEffect(() => {
    setNome("Admin CEO");
    setEmail("CEO@admin.com");
    setSenha("12345");
    setTelefone("(11) 91234-5678");
    setNascimento("2000-01-01");
    setSexo("Masculino");
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          telefone,
          nascimento,
          sexo,
        }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Resposta inválida do servidor.");
      }

      if (res.ok) {
        setMensagem("✅ Cadastro realizado com sucesso!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMensagem("❌ " + (data?.erro || "Erro desconhecido."));
      }
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1b25] text-white font-sans">
      <div className="bg-white text-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>

        {mensagem && (
          <div className="bg-blue-100 text-blue-800 p-3 rounded text-sm mb-4">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none text-black"
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none text-black"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none text-black"
            required
          />

          <input
            type="tel"
            placeholder="Telefone (opcional)"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none text-black"
          />

          <input
            type="date"
            placeholder="Data de Nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none text-black"
          />

          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full px-4 py-2 rounded border focus:outline-none text-black"
          >
            <option value="">Selecione o sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não dizer">Prefiro não dizer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}
