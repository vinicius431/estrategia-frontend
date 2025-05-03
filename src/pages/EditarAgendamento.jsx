import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditarAgendamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cta, setCta] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [imagemAtual, setImagemAtual] = useState("");
  const [novaImagem, setNovaImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const buscar = async () => {
      try {
        const res = await fetch(`${API_URL}/agendamentos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const agendamento = data.find((item) => item._id === id);
        if (agendamento) {
          setTitulo(agendamento.titulo || "");
          setDescricao(agendamento.descricao || "");
          setCta(agendamento.cta || "");
          setHashtags(agendamento.hashtags || "");
          setData(agendamento.data || "");
          setHora(agendamento.hora || "");
          setImagemAtual(agendamento.imagem || "");
        } else {
          setMensagem("Agendamento não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setMensagem("Erro ao carregar dados.");
      }
    };
    buscar();
  }, [id]);

  const handleSalvar = async () => {
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("cta", cta);
      formData.append("hashtags", hashtags);
      formData.append("data", data);
      formData.append("hora", hora);
      if (novaImagem) {
        formData.append("imagem", novaImagem);
      }

      const res = await fetch(`${API_URL}/agendamentos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMensagem("✅ Alterações salvas com sucesso!");
        setTimeout(() => navigate("/dashboard/meus-conteudos"), 1500);
      } else {
        const erro = await res.json();
        setMensagem("❌ Erro ao salvar: " + (erro.erro || "Erro desconhecido"));
      }
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro de conexão.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Editar Agendamento</h1>

      {mensagem && (
        <div className="mb-4 p-3 rounded text-sm bg-blue-100 text-blue-800 border border-blue-300">
          {mensagem}
        </div>
      )}

      <div className="space-y-4">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          className="w-full px-4 py-2 rounded border text-black"
        />
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          rows={4}
          className="w-full px-4 py-2 rounded border text-black"
        />
        <input
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          placeholder="CTA"
          className="w-full px-4 py-2 rounded border text-black"
        />
        <input
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="#hashtags"
          className="w-full px-4 py-2 rounded border text-black"
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full px-4 py-2 rounded border text-black"
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="w-full px-4 py-2 rounded border text-black"
        />

        {imagemAtual && (
          <div>
            <label className="block text-sm font-semibold mb-1">Mídia Atual:</label>
            {imagemAtual.match(/\.(mp4|webm|mov|avi)$/i) ? (
              <video src={imagemAtual} controls className="w-full rounded max-h-64" />
            ) : (
              <img src={imagemAtual} alt="Atual" className="w-full rounded max-h-64 object-contain" />
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1 mt-2">Nova imagem ou vídeo (opcional):</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setNovaImagem(e.target.files[0])}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSalvar}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
