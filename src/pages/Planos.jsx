import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Planos() {
  const [planoAtivo, setPlanoAtivo] = useState("Starter");

  useEffect(() => {
    const planoSalvo = localStorage.getItem("planoAtivo");
    if (planoSalvo) setPlanoAtivo(planoSalvo);
  }, []);

  const planos = [
    {
      nome: "Starter",
      preco: "R$49,90/mês",
      cor: "border-purple-500",
      beneficios: [
        "15 agendamentos por mês",
        "Gerador de hashtag 1 vez por dia",
        "Central de Ideias limitada",
        "Sem Modo Tutor",
        "Biblioteca de imagens",
        "Acesso a Meus Conteúdos",
        "Use a IA até 2 vezes por dia — cada uso gera várias ideias de conteúdo"
      ]
    },
    {
      nome: "Plus",
      preco: "R$99,90/mês",
      cor: "border-blue-500",
      beneficios: [
        "30 agendamentos por mês",
        "Gerador de hashtag 5 vezes por dia",
        "Central de Ideias ilimitada",
        "Modo Tutor limitado",
        "Biblioteca de imagens",
        "Acesso a Meus Conteúdos",
        "Use a IA até 5 vezes por dia — cada uso gera várias ideias de conteúdo"
      ]
    },
    {
      nome: "Premium",
      preco: "R$129,90/mês",
      cor: "border-green-600",
      beneficios: [
        "Agendamentos ilimitados",
        "Gerador de hashtag ilimitado",
        "Central de Ideias ilimitada",
        "Modo Tutor completo",
        "Biblioteca de imagens",
        "Acesso a Meus Conteúdos",
        "Use a IA até 15 vezes por dia — cada uso gera várias ideias de conteúdo"
      ],
      destaque: true
    }
  ];

  const confirmarTroca = async (novoPlano) => {
    if (novoPlano === planoAtivo) {
      toast("Você já está nesse plano.");
      return;
    }

    const confirmar = window.confirm(`Tem certeza que deseja mudar para o plano ${novoPlano}?`);
    if (!confirmar) return;

    const usuarioStr = localStorage.getItem("usuario");
    if (!usuarioStr) return;

    const usuario = JSON.parse(usuarioStr);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/atualizar-plano`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usuario.email, novoPlano }),
      });

      const data = await res.json();

      if (res.ok) {
        usuario.plano = data.plano;
        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("planoAtivo", data.plano);
        setPlanoAtivo(data.plano);
        toast.success(`Plano ${data.plano} ativado com sucesso!`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(data.erro || "Erro ao atualizar o plano.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Escolha seu plano</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((plano, idx) => {
          const ativo = plano.nome === planoAtivo;
          return (
            <div
              key={idx}
              className={`border-2 rounded-xl p-6 shadow-md ${plano.cor} ${
                plano.destaque ? "bg-green-50 border-4" : ativo ? "bg-blue-50" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{plano.nome}</h2>
              <p className="text-lg font-semibold mb-4">{plano.preco}</p>
              <ul className="text-sm space-y-2 mb-6">
                {plano.beneficios.map((b, i) => (
                  <li key={i} className="text-gray-700">• {b}</li>
                ))}
              </ul>
              <button
                onClick={() => confirmarTroca(plano.nome)}
                className={`w-full px-4 py-2 rounded-md font-medium transition ${
                  ativo
                    ? "bg-gray-300 text-gray-800 cursor-default"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={ativo}
              >
                {ativo ? "Plano Atual" : "Ativar Plano"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
