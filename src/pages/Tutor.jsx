import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tutor() {
  const navigate = useNavigate();
  const [tema, setTema] = useState("");
  const [headlines, setHeadlines] = useState([]);
  const [descricoes, setDescricoes] = useState([]);
  const [ctas, setCtas] = useState([]);
  const [hashtags, setHashtags] = useState([]);

  const [tituloSelecionado, setTituloSelecionado] = useState("");
  const [descricaoSelecionada, setDescricaoSelecionada] = useState("");
  const [ctaSelecionada, setCtaSelecionada] = useState("");
  const [hashtagsSelecionadas, setHashtagsSelecionadas] = useState([]);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const gerarSugestoesIA = async () => {
    if (!tema.trim()) {
      toast.error("Digite um tema primeiro.");
      return;
    }

    setCarregando(true);
    setErro("");
    setHeadlines([]);
    setDescricoes([]);
    setCtas([]);
    setHashtags([]);
    setTituloSelecionado("");
    setDescricaoSelecionada("");
    setCtaSelecionada("");
    setHashtagsSelecionadas([]);

    try {
      const res = await fetch(`${API_URL}/gerar-tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });

      const data = await res.json();
      if (res.ok) {
        setHeadlines(data.headlines || []);
        setDescricoes(data.descricoes || []);
        setCtas(data.ctas || []);
        setHashtags(data.hashtags || []);
      } else {
        setErro(data.erro || "Erro ao gerar sugestões.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao conectar com a IA.");
    }

    setCarregando(false);
  };

  const toggleHashtag = (tag) => {
    if (hashtagsSelecionadas.includes(tag)) {
      setHashtagsSelecionadas(hashtagsSelecionadas.filter((t) => t !== tag));
    } else {
      setHashtagsSelecionadas([...hashtagsSelecionadas, tag]);
    }
  };

  const irParaAgendador = () => {
    if (!tituloSelecionado || !descricaoSelecionada || !ctaSelecionada) {
      toast.error("Selecione todas as partes do conteúdo.");
      return;
    }

    const query = new URLSearchParams({
      titulo: tituloSelecionado,
      descricao: descricaoSelecionada,
      cta: ctaSelecionada,
      hashtags: hashtagsSelecionadas.join(" "),
    }).toString();

    navigate(`/dashboard/agendador?${query}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">Modo Tutor 👨‍🏫</h1>

      <div>
        <label className="block font-semibold mb-1">Tema do conteúdo</label>
        <input
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: marketing de conteúdo, motivação, vendas online..."
          className="w-full px-4 py-2 border rounded-md text-black"
        />
        <button
          onClick={gerarSugestoesIA}
          className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          disabled={carregando}
        >
          {carregando ? "Gerando sugestões..." : "Gerar com IA"}
        </button>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      {headlines.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">🎯 Headline</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {headlines.map((h, i) => (
              <button
                key={i}
                onClick={() => setTituloSelecionado(h)}
                className={`p-3 rounded border ${
                  tituloSelecionado === h
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black hover:bg-blue-100"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {descricoes.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">📝 Descrição</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {descricoes.map((d, i) => (
              <button
                key={i}
                onClick={() => setDescricaoSelecionada(d)}
                className={`p-3 rounded border text-left ${
                  descricaoSelecionada === d
                    ? "bg-green-600 text-white"
                    : "bg-white text-black hover:bg-green-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {ctas.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">📢 Chamada para Ação (CTA)</h2>
          <div className="flex flex-wrap gap-3">
            {ctas.map((c, i) => (
              <button
                key={i}
                onClick={() => setCtaSelecionada(c)}
                className={`px-4 py-2 rounded-full border ${
                  ctaSelecionada === c
                    ? "bg-purple-600 text-white"
                    : "bg-white text-black hover:bg-purple-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {hashtags.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">🏷️ Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <button
                key={i}
                onClick={() => toggleHashtag(tag)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  hashtagsSelecionadas.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {tituloSelecionado && descricaoSelecionada && ctaSelecionada && (
        <div className="mt-6 p-4 border rounded bg-gray-50 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">🔍 Prévia do conteúdo:</h3>
          <p className="mb-2 font-bold">{tituloSelecionado}</p>
          <p className="mb-2">{descricaoSelecionada}</p>
          <p className="mb-2 italic text-green-700">CTA: {ctaSelecionada}</p>
          <p className="text-sm text-gray-700">{hashtagsSelecionadas.join(" ")}</p>
        </div>
      )}

      <div className="pt-6">
        <button
          onClick={irParaAgendador}
          disabled={!tituloSelecionado || !descricaoSelecionada || !ctaSelecionada}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          Usar no Agendador
        </button>
      </div>
    </div>
  );
}
