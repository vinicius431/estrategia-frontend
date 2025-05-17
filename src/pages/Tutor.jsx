import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tutor() {
  const navigate = useNavigate();

  const [tema, setTema] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cta, setCta] = useState("");
  const [hashtagsSelecionadas, setHashtagsSelecionadas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const gerarSugestoesIA = async () => {
    if (!tema.trim()) {
      toast.error("Digite um tema para gerar sugestões.");
      return;
    }

    setCarregando(true);
    setErro("");
    setTitulo("");
    setDescricao("");
    setCta("");
    setHashtagsSelecionadas([]);

    try {
      const res = await fetch(`${API_URL}/gerar-tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });

      const data = await res.json();

      if (res.ok) {
        setTitulo(data.headline || "");
        setDescricao(data.descricao || "");
        setCta(data.cta || "");
        setHashtagsSelecionadas(data.hashtags || []);
      } else {
        setErro(data.erro || "Erro ao gerar conteúdo.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor.");
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
    const query = new URLSearchParams({
      titulo: encodeURIComponent(titulo),
      descricao: encodeURIComponent(descricao),
      cta: encodeURIComponent(cta),
      hashtags: encodeURIComponent(hashtagsSelecionadas.join(" ")),
    }).toString();

    navigate(`/dashboard/agendador?${query}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Modo Tutor 👨‍🏫</h1>

      <div>
        <label className="block font-semibold mb-1">Sobre o que você quer criar conteúdo?</label>
        <input
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: treinos em casa, vendas online, foco no trabalho..."
          className="w-full px-4 py-2 border rounded-md text-black"
        />
        <button
          onClick={gerarSugestoesIA}
          className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          disabled={carregando}
        >
          {carregando ? "Gerando..." : "Gerar sugestões"}
        </button>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

      <div>
        <label className="block font-semibold mb-1">Headline (Título)</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Descrição</label>
        <textarea
          rows="3"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">CTA (Chamada para ação)</label>
        <input
          type="text"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">Hashtags</label>
        <div className="flex flex-wrap gap-2">
          {hashtagsSelecionadas.map((tag) => (
            <button
              key={tag}
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

      <div className="pt-4">
        <button
          onClick={irParaAgendador}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Usar no Agendador
        </button>
      </div>
    </div>
  );
}
