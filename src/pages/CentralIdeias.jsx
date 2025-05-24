import React, { useState, useEffect } from "react";
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
  const [titulosGerados, setTitulosGerados] = useState([]);
  const [descricaoGeradas, setDescricaoGeradas] = useState([]);
  const [loadingTitulo, setLoadingTitulo] = useState(false);
  const [loadingDescricao, setLoadingDescricao] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Carregar ideias salvas do localStorage
  useEffect(() => {
    const temaSalvo = localStorage.getItem("centralTema");
    const titulosSalvos = JSON.parse(localStorage.getItem("centralTitulos") || "[]");
    const descricoesSalvas = JSON.parse(localStorage.getItem("centralDescricoes") || "[]");

    if (temaSalvo) setTema(temaSalvo);
    if (titulosSalvos.length) setTitulosGerados(titulosSalvos);
    if (descricoesSalvas.length) setDescricaoGeradas(descricoesSalvas);
  }, []);

  // Salvar ideias no localStorage
  const salvarIdeias = (tema, titulos, descricoes) => {
    localStorage.setItem("centralTema", tema);
    localStorage.setItem("centralTitulos", JSON.stringify(titulos));
    localStorage.setItem("centralDescricoes", JSON.stringify(descricoes));
  };

  const gerarTitulo = async () => {
    if (!tema.trim()) {
      toast.error("Digite um tema para gerar os títulos.");
      return;
    }

    setLoadingTitulo(true);
    setMensagem("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gerar-headline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });
      const data = await res.json();
      if (res.ok && data.titulos) {
        setTitulosGerados(data.titulos);
        salvarIdeias(tema, data.titulos, descricaoGeradas);
      } else {
        setMensagem(data.erro || "Erro ao gerar títulos.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro de conexão.");
    }

    setLoadingTitulo(false);
  };

  const gerarDescricao = async () => {
    if (!tema.trim()) {
      toast.error("Digite um tema para gerar os textos.");
      return;
    }

    setLoadingDescricao(true);
    setMensagem("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gerar-descricao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });
      const data = await res.json();
      if (res.ok && data.descricoes) {
        setDescricaoGeradas(data.descricoes);
        salvarIdeias(tema, titulosGerados, data.descricoes);
      } else {
        setMensagem(data.erro || "Erro ao gerar textos.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro de conexão.");
    }

    setLoadingDescricao(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loadingTitulo ? "Gerando Títulos..." : "🎯 Gerar Títulos"}
        </button>
        <button
          onClick={gerarDescricao}
          disabled={loadingDescricao}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {loadingDescricao ? "Gerando Textos..." : "📝 Gerar Textos"}
        </button>
      </div>

      {mensagem && <p className="text-red-600 mb-4">{mensagem}</p>}

      {titulosGerados.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">💡 Títulos Gerados:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {titulosGerados.map((titulo, i) => (
              <div key={i} className="border p-4 rounded shadow bg-white text-gray-800">
                {titulo}
              </div>
            ))}
          </div>
        </div>
      )}

      {descricaoGeradas.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-700 mb-2">📝 Textos Gerados:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {descricaoGeradas.map((descricao, i) => (
              <div key={i} className="border p-4 rounded shadow bg-white text-gray-800">
                {descricao}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
