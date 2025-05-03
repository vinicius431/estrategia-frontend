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
  const [headlines, setHeadlines] = useState([]);
  const [descricoes, setDescricoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [preview, setPreview] = useState({ titulo: "", descricao: "" });
  const navigate = useNavigate();

  const gerar = async () => {
    if (!tema.trim()) return;

    setLoading(true);
    setMensagem("");
    setHeadlines([]);
    setDescricoes([]);
    setPreview({ titulo: "", descricao: "" });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gerar-conteudo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema }),
      });

      const data = await res.json();
      if (res.ok) {
        setHeadlines(data.headlines || []);
        setDescricoes(data.descricoes || []);
      } else {
        setMensagem("❌ Erro: " + (data.erro || "Erro desconhecido"));
      }
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro de conexão com o servidor.");
    }

    setLoading(false);
  };

  const copiarTexto = (texto) => {
    navigator.clipboard.writeText(texto);
    toast.success("Copiado!");
  };

  const usarNoAgendador = (titulo, descricao) => {
    const t = encodeURIComponent(titulo);
    const d = encodeURIComponent(descricao);
    navigate(`/dashboard/agendador?titulo=${t}&descricao=${d}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Central de Ideias ✨</h1>
      <p className="mb-6 text-gray-700 italic">“{fraseDoDia}”</p>

      <div className="mb-8">
        <label className="block font-semibold mb-1">Sobre o que é seu conteúdo?</label>
        <input
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: Dicas de produtividade para redes sociais"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={gerar}
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Gerando..." : "Gerar com IA"}
        </button>
      </div>

      {mensagem && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{mensagem}</div>
      )}

      {headlines.length > 0 && descricoes.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {headlines.map((h, i) => (
              <div
                key={i}
                className="bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition group"
              >
                <h3 className="text-lg font-semibold text-blue-700 mb-2">💡 {h}</h3>
                <p className="text-gray-700 mb-2">{descricoes[i] || ""}</p>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => copiarTexto(h)}
                    className="text-blue-600 hover:underline"
                  >
                    Copiar título
                  </button>
                  <button
                    onClick={() => copiarTexto(descricoes[i] || "")}
                    className="text-green-600 hover:underline"
                  >
                    Copiar descrição
                  </button>
                  <button
                    onClick={() => {
                      setPreview({ titulo: h, descricao: descricoes[i] || "" });
                      usarNoAgendador(h, descricoes[i] || "");
                    }}
                    className="text-gray-600 hover:underline"
                  >
                    Usar no Agendador
                  </button>
                </div>
              </div>
            ))}
          </div>

          {preview.titulo && (
            <div className="bg-gray-50 p-6 rounded-xl border">
              <h2 className="text-xl font-bold mb-2 text-gray-800">🔎 Prévia do conteúdo</h2>
              <div className="bg-white border p-4 rounded shadow max-w-md">
                <h3 className="text-blue-800 font-semibold text-lg mb-1">{preview.titulo}</h3>
                <p className="text-gray-700">{preview.descricao}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
