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
  Wand2
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

  useEffect(() => {
    const agendados = JSON.parse(localStorage.getItem("agendamentos")) || [];
    setTotalAgendados(agendados.length);

    if (agendados.length > 0) {
      const ultima = agendados[agendados.length - 1];
      setUltimaData(ultima.data || "Não informado");
    }

    const tutorInfo = JSON.parse(localStorage.getItem("tutorTema"));
    if (tutorInfo) setUltimoTema(tutorInfo);

    const frequenciaSemanal = [0, 0, 0, 0];
    const hoje = new Date();
    const dias = [];

    agendados.forEach((post) => {
      const data = new Date(post.data);
      dias.push(data.toDateString());
      const diff = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
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
  }, []);

  const tileClassName = ({ date }) => {
    return diasComPost.includes(date.toDateString()) ? "bg-blue-500 text-white rounded-full" : null;
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold">Motivação do Dia</h2>
        <p className="text-lg italic mt-2">“{fraseDoDia}”</p>
      </div>

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

      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarRange className="text-blue-500" /> Calendário de Postagens
        </h3>
<Calendar
  tileClassName={({ date }) =>
    diasComPost.includes(date.toDateString())
      ? "highlighted-date"
      : ""
  }
  className="custom-calendar rounded-2xl w-full max-w-full"
/>
      </div>

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
