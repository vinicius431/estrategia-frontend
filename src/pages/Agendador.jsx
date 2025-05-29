import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Agendador() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const tituloParam = decodeURIComponent(searchParams.get("titulo") || "");
  const descricaoParam = decodeURIComponent(searchParams.get("descricao") || "");
  const ctaParam = decodeURIComponent(searchParams.get("cta") || "");
  const hashtagsParam = decodeURIComponent(searchParams.get("hashtags") || "");

  const [step, setStep] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cta, setCta] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [imagem, setImagem] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const [conectado, setConectado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    setTitulo(tituloParam);
    setDescricao(descricaoParam);
    setCta(ctaParam);
    setHashtags(hashtagsParam);
  }, [tituloParam, descricaoParam, ctaParam, hashtagsParam]);

  useEffect(() => {
  const verificarIntegracaoInstagram = async () => {
    try {
      const res = await fetch(`${API_URL}/integracao/instagram`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.instagramBusinessId && data.instagramAccessToken) {
        setConectado(true);
        setNomeUsuario("Perfil conectado ✅");
      }
    } catch (err) {
      console.error("❌ Erro ao verificar integração:", err);
    }
  };

  verificarIntegracaoInstagram();
}, []);


  const handleLoginFacebook = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          window.FB.api("/me/accounts", function (pageResponse) {
            const page = pageResponse.data?.[0];
            if (!page) return console.log("❌ Nenhuma página encontrada");

            const pageId = page.id;
            const pageAccessToken = page.access_token;

            window.FB.api(
              `/${pageId}?fields=connected_instagram_account{name}`,
              function (instaResponse) {
                if (instaResponse.connected_instagram_account) {
                  const igId = instaResponse.connected_instagram_account.id;
                  const igName = instaResponse.connected_instagram_account.name;
                  console.log("✅ Instagram conectado:", igId);

                  setConectado(true);
                  setNomeUsuario(igName || "Perfil conectado");

                  
                  // Envia os dados para o backend
fetch(`${API_URL}/integracao/instagram`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    instagramAccessToken: pageAccessToken,
    instagramBusinessId: igId,
    facebookPageId: pageId,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("📥 Dados salvos no backend:", data);
  })
  .catch((err) => {
    console.error("❌ Erro ao salvar integração:", err);
  });

                } else {
                  console.log("❌ Nenhuma conta do Instagram conectada à página.");
                }
              }
            );
          });
        } else {
          console.log("❌ Login cancelado ou sem autorização");
        }
      },
      {
        scope:
          "pages_show_list,instagram_basic,instagram_content_publish,pages_read_engagement",
      }
    );
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMensagem("");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("cta", cta);
    formData.append("hashtags", hashtags);
    formData.append("data", data);
    formData.append("hora", hora);
    formData.append("status", "agendado");

    if (imagem) {
      formData.append("imagem", imagem, imagem.name);
    }

    try {
      const res = await fetch(`${API_URL}/agendamentos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        if (res.ok) {
          setMensagem("✅ Agendamento realizado com sucesso!");
          setStep(1);
          setTitulo("");
          setDescricao("");
          setCta("");
          setHashtags("");
          setData("");
          setHora("");
          setImagem(null);
          setPreviewImg(null);
        } else {
          setMensagem("❌ Erro ao agendar: " + (data?.erro || "Erro desconhecido."));
        }
      } catch (jsonErr) {
        setMensagem("❌ Erro inesperado: " + text);
      }
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!previewImg) return null;
    if (imagem?.type?.startsWith("video")) {
      return <video src={previewImg} controls className="rounded mb-4 max-w-xs" />;
    }
    return <img src={previewImg} alt="Preview" className="rounded mb-4 max-w-xs" />;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">1️⃣ Conteúdo</h2>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do Post"
              className="w-full px-4 py-2 rounded border text-black"
              required
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">2️⃣ Data, Hora e Mídia</h2>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-2 rounded border text-black"
              required
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-4 py-2 rounded border text-black"
              required
            />
            <input type="file" accept="image/*,video/*" onChange={handleImagem} />
            {previewImg && renderPreview()}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">3️⃣ Preview Final</h2>
            <div className="bg-white rounded-lg shadow p-4 text-black">
              {renderPreview()}
              <h3 className="text-lg font-bold">{titulo}</h3>
              <p className="mb-2">{descricao}</p>
              {cta && <p className="italic mb-1">👉 {cta}</p>}
              {hashtags && (
                <p className="text-blue-600 text-sm font-mono">{hashtags}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Publicar em: {data || "sem data"} às {hora || "sem hora"}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agendador de Conteúdo 📅</h1>

      {/* ✅ Status de conexão com Instagram */}
      <div className="mb-4">
        {!conectado ? (
          <button
            onClick={handleLoginFacebook}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔗 Conectar Instagram
          </button>
        ) : (
          <div className="text-green-500 font-medium">
            ✅ Instagram conectado: {nomeUsuario}
          </div>
        )}
      </div>

      {mensagem && (
        <div className="mb-4 p-3 rounded text-sm bg-blue-100 text-blue-800 border border-blue-300">
          {mensagem}
        </div>
      )}

      <div className="bg-[#0d1b25] p-6 rounded-xl shadow-md text-white space-y-6">
        {renderStep()}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              disabled={loading}
            >
              Voltar
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded text-white transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Agendando..." : "Agendar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
