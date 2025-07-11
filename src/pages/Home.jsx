import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CalendarRange,
  FileText,
  Lightbulb,
  Wand2,
  Users,
  Heart
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const frases = [
  "Quem planta consistência colhe resultados.",
  "Pequenos passos diários constroem grandes conquistas.",
  "Ideias são sementes. Ação é rega.",
  "Você não precisa postar mais. Precisa postar certo.",
  "A constância vence o talento quando o talento não é constante.",
  "Sua mensagem só transforma se for compartilhada."
];

const fraseDoDia = frases[new Date().getDate() % frases.length];

export default function Home() {
  const [totalAgendados, setTotalAgendados] = useState(0);
  const [ultimaData, setUltimaData] = useState("");
  const [ultimoTema, setUltimoTema] = useState("");
  const [frequencia, setFrequencia] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [diasComPost, setDiasComPost] = useState([]);
  const [insights, setInsights] = useState(null);
  const [erroInsights, setErroInsights] = useState("");
  const [instagramConectado, setInstagramConectado] = useState(false);

  // ✅ Dados reais do backend
  useEffect(() => {
    async function fetchAgendamentosReais() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || "Erro ao buscar agendamentos");

        setTotalAgendados(data.length);

        if (data.length > 0) {
          const ultima = data[data.length - 1];
          setUltimaData(ultima.data || "Não informado");
        }

        const frequenciaSemanal = [0, 0, 0, 0];
        const hoje = new Date();
        const dias = [];

        data.forEach((post) => {
          const dataPost = new Date(post.data);
          dias.push(dataPost.toDateString());
          const diff = Math.floor((hoje - dataPost) / (1000 * 60 * 60 * 24));
          const semana = Math.floor(diff / 7);
          if (semana >= 0 && semana < 4) {
            frequenciaSemanal[3 - semana]++;
          }
        });

        setDiasComPost(dias);

        const labels = ["Há 3 sem", "Há 2 sem", "Semana passada", "Atual"];
        const dataset = frequenciaSemanal.map((qtd, i) => ({ semana: labels[i], posts: qtd }));
        setFrequencia(dataset);

        const atual = dataset[3].posts;
        const anterior = dataset[2].posts;

        if (atual > anterior) {
          setMensagem("🎉 Sua frequência aumentou. Continue nesse ritmo!");
        } else if (atual < anterior) {
          setMensagem("⚠️ Sua frequência caiu. Lembre-se: constância gera resultados.");
        } else {
          setMensagem("📌 Frequência estável. A constância faz o sucesso acontecer.");
        }
      } catch (err) {
        console.error("Erro ao buscar agendamentos reais:", err.message);
      }
    }

    fetchAgendamentosReais();

    const tutorInfo = JSON.parse(localStorage.getItem("tutorTema"));
    if (tutorInfo) setUltimoTema(tutorInfo);
  }, []);

  useEffect(() => {
    async function fetchInstagramInsights() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/instagram/insights`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || "Erro ao buscar insights");
        setInsights(data);
      } catch (err) {
        console.error("Erro ao buscar insights:", err);
        setErroInsights("Erro ao carregar dados do Instagram.");
      }
    }

    fetchInstagramInsights();
  }, []);

  useEffect(() => {
    async function verificarIntegracao() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/integracao/instagram`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.instagramAccessToken && data.instagramBusinessId) {
          setInstagramConectado(true);
        } else {
          setInstagramConectado(false);
        }
      } catch (err) {
        console.error("Erro ao verificar integração do Instagram:", err);
        setInstagramConectado(false);
      }
    }

    verificarIntegracao();
  }, []);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold">Motivação do Dia</h2>
        <p className="text-lg italic mt-2">“{fraseDoDia}”</p>
      </div>

      {!instagramConectado && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl shadow-md">
          <p className="text-sm mb-2 font-medium">
            Você ainda não conectou sua conta do Instagram.
          </p>
          <button
            onClick={() =>
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Conectar Instagram
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center gap-4">
          <CalendarCheck className="text-blue-600" size={32} />
          <div>
            <h3 className="text-lg font-semibold">Agendados</h3>
            <p className="text-2xl font-bold">{totalAgendados}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center gap-4">
          <Clock className="text-yellow-500" size={32} />
          <div>
            <h3 className="text-lg font-semibold">Última Publicação</h3>
            <p className="text-sm text-gray-600">{ultimaData || "Nenhuma"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center gap-4">
          <Sparkles className="text-purple-600" size={32} />
          <div>
            <h3 className="text-lg font-semibold">Último Tema</h3>
            <p className="text-sm text-gray-600">{ultimoTema || "Nada gerado ainda"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border flex items-center gap-4">
          <ArrowRight className="text-green-600" size={32} />
          <div>
            <h3 className="text-lg font-semibold">Próxima Ação</h3>
            <a href="/dashboard/agendador" className="text-blue-600 underline text-sm hover:text-blue-800">
              Agendar novo conteúdo →
            </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <div className="mb-4 flex items-center gap-2">
            {mensagem.includes("aumentou") ? (
              <TrendingUp className="text-green-600" />
            ) : mensagem.includes("caiu") ? (
              <TrendingDown className="text-red-600" />
            ) : (
              <Sparkles className="text-blue-600" />
            )}
            <span className="text-sm text-gray-800 font-medium">{mensagem}</span>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={frequencia} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <XAxis dataKey="semana" stroke="#8884d8" />
              <YAxis allowDecimals={false} stroke="#8884d8" />
              <Tooltip />
              <Line type="monotone" dataKey="posts" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-sm text-gray-600 italic">
            A constância é o diferencial de quem alcança resultados no digital.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CalendarRange className="text-blue-500" /> Calendário de Postagens
          </h3>
          <Calendar
            tileClassName={({ date }) =>
              diasComPost.includes(date.toDateString()) ? "highlighted-date" : ""
            }
            className="custom-calendar rounded-2xl w-full max-w-full"
          />
        </div>
      </div>

      {erroInsights ? (
        <div className="text-red-500">{erroInsights}</div>
      ) : insights && insights.data ? (
        <div className="grid md:grid-cols-3 gap-6">
          {insights.data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border flex items-center gap-4"
            >
              <Users className="text-blue-600" size={32} />
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {item.title.replace("_", " ")}
                </h3>
                <p className="text-2xl font-bold">
                  {item.values && item.values[0] ? item.values[0].value : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">Carregando dados do Instagram...</div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <a href="/dashboard/meus-conteudos" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-md flex items-center gap-3">
          <FileText /> Meus Conteúdos
        </a>
        <a href="/dashboard/tutor" className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl shadow-md flex items-center gap-3">
          <Wand2 /> Modo Tutor
        </a>
        <a href="/dashboard/ideias" className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-md flex items-center gap-3">
          <Lightbulb /> Central de Ideias
        </a>
      </div>
    </div>
  );
}
