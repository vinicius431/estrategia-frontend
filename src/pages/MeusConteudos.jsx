import React, { useEffect, useState } from "react";

export default function MeusConteudos() {
  const [conteudos, setConteudos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalUrl, setModalUrl] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAgendados = async () => {
      try {
        const res = await fetch(`${API_URL}/agendamentos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setConteudos(data.reverse());
        } else {
          console.error("Resposta inesperada do servidor:", data);
        }
      } catch (err) {
        console.error("Erro ao buscar conteúdos:", err);
      }
    };

    fetchAgendados();
  }, []);

  const handleExcluir = async (id) => {
    const confirmacao = confirm("Tem certeza que deseja excluir este agendamento?");
    if (!confirmacao) return;

    try {
      const res = await fetch(`${API_URL}/agendamentos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        setConteudos((prev) => prev.filter((item) => item._id !== id));
      } else {
        const erro = await res.json();
        alert("Erro ao excluir: " + erro.erro);
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const filtrados = conteudos
    .filter((item) =>
      item.titulo?.toLowerCase().includes(filtroTexto.toLowerCase())
    )
    .filter((item) =>
      filtroStatus === "todos" ? true : item.status === filtroStatus
    );

  const renderMedia = (url) => {
    if (!url)
      return (
        <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded">
          Sem mídia
        </div>
      );

    const isVideo = url.match(/\.(mp4|webm|mov|avi)$/i);
    return (
      <div onClick={() => setModalUrl(url)} className="cursor-pointer">
        {isVideo ? (
          <video src={url} controls className="w-full h-40 object-cover rounded" />
        ) : (
          <img src={url} alt="Post" className="w-full h-40 object-cover rounded" />
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">
          Meus Conteúdos ({filtrados.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Filtrar por título..."
            className="px-4 py-2 border rounded-md w-full sm:w-64 text-sm"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="todos">Todos</option>
            <option value="agendado">Agendados</option>
            <option value="postado">Postados</option>
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-gray-500">Nenhum conteúdo encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtrados.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg shadow p-4 space-y-3"
            >
              {renderMedia(item.imagem)}
              <div>
                <h3 className="text-lg font-semibold">{item.titulo}</h3>
                <p className="text-sm text-gray-500">
                  Publicar em: {new Date(item.data).toLocaleDateString()}
                  {item.hora && ` às ${item.hora}`}
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {item.descricao?.length > 120
                    ? item.descricao.substring(0, 120) + "..."
                    : item.descricao}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 gap-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === "agendado"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.status}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      window.location.href = `/agendador?titulo=${encodeURIComponent(item.titulo)}&descricao=${encodeURIComponent(item.descricao)}&cta=${encodeURIComponent(item.cta)}&hashtags=${encodeURIComponent(item.hashtags)}`
                    }
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(item._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setModalUrl(null)}
        >
          <div className="max-w-3xl w-full p-4 bg-white rounded-lg shadow-lg relative">
            <button
              onClick={() => setModalUrl(null)}
              className="absolute top-2 right-4 text-black font-bold text-xl"
            >
              ×
            </button>
            {modalUrl.match(/\.(mp4|webm|mov|avi)$/i) ? (
              <video
                src={modalUrl}
                controls
                className="w-full h-auto max-h-[80vh] rounded"
              />
            ) : (
              <img
                src={modalUrl}
                alt="Visualização"
                className="w-full h-auto max-h-[80vh] rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
