import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const frases = [
  "Crie uma solução antes do problema surgir.",
  "Ideias ganham poder quando são executadas.",
  "Você não precisa postar mais, precisa postar certo.",
  "Quem planeja, lucra. Quem improvisa, cansa.",
  "Uma headline poderosa vale por mil palavras.",
];

const fraseDoDia = frases[Math.floor(Math.random() * frases.length)];

export default function CentralIdeias() {
  const [tema, setTema] = useState("");
  const [tituloGerado, setTituloGerado] = useState("");
  const [descricaoGerada, setDescricaoGerada] = useState("");
  const [loadingTitulo, setLoadingTitulo] = useState(false);
  const [loadingDescricao, setLoadingDescricao] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const gerarTitulo = async () => {
    if (!tema.trim()) {
      toast.error("Digite um tema para gerar o título.");
      return;
    }

    setLoadingTitulo(true);
    setMensagem("");
    setTituloGerado("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gerar-headline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });
      const data = await res.json();
      if (res.ok) {
        setTituloGerado(data.titulo || "");
      } else {
        setMensagem(data.erro || "Erro ao gerar título.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro de conexão.");
    }

    setLoadingTitulo(false);
  };

  const gerarDescricao = async () => {
    if (!tema.trim()) {
      toast.error("Digite um tema para gerar o texto.");
      return;
    }

    setLoadingDescricao(true);
    setMensagem("");
    setDescricaoGerada("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gerar-descricao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });
      const data = await res.json();
      if (res.ok) {
        setDescricaoGerada(data.descricao || "");
      } else {
        setMensagem(data.erro || "Erro ao gerar texto.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro de conexão.");
    }

    setLoadingDescricao(false);
  };

  const usarNoAgendador = () => {
    if (!tituloGerado && !descricaoGerada) {
      toast.error("Gere pelo menos um título ou uma descrição.");
      return;
    }

    toast.success("Ideia enviada para o Agendador 🚀");
    const t = encodeURIComponent(tituloGerado);
    const d = encodeURIComponent(descricaoGerada);
    navigate(`/dashboard/agendador?titulo=${t}&descricao=${d}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Central de Ideias ✨</h1>
      <p className="mb-6 text-gray-700 italic">“{fraseDoDia}”</p>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Sobre o que é seu conteúdo?</label>
        <input
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: Superação pessoal no dia a dia"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={gerarTitulo}
          disabled={loadingTitulo}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
        >
          {loadingTitulo ? "Gerando Título..." : "🎯 Gerar Título"}
        </button>
        <button
          onClick={gerarDescricao}
          disabled={loadingDescricao}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center justify-center"
        >
          {loadingDescricao ? "Gerando Texto..." : "📝 Gerar Texto"}
        </button>
        <button
          onClick={usarNoAgendador}
          className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
        >
          Usar no Agendador
        </button>
      </div>

      {mensagem && <p className="text-red-600 mb-4">{mensagem}</p>}

      {(tituloGerado || descricaoGerada) && (
        <div className="bg-white border rounded-xl p-6 shadow-md">
          {tituloGerado && (
            <div className="mb-4">
              <h3 className="text-blue-800 font-semibold text-lg">💡 Título Gerado:</h3>
              <p className="text-gray-700">{tituloGerado}</p>
            </div>
          )}
          {descricaoGerada && (
            <div>
              <h3 className="text-green-800 font-semibold text-lg">📝 Texto Gerado:</h3>
              <p className="text-gray-700">{descricaoGerada}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
