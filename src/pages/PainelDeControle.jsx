import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { BarChart, Bar } from "recharts";

const dataDesempenho = [
  { name: 'Seg', posts: 2, alcance: 500 },
  { name: 'Ter', posts: 1, alcance: 300 },
  { name: 'Qua', posts: 3, alcance: 850 },
  { name: 'Qui', posts: 0, alcance: 0 },
  { name: 'Sex', posts: 4, alcance: 1200 },
  { name: 'Sab', posts: 1, alcance: 200 },
  { name: 'Dom', posts: 2, alcance: 450 }
];

export default function PainelDeControle() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Painel de Controle 📊</h1>
      <p className="text-gray-600">Acompanhe sua performance nas redes sociais e melhore seus resultados com base nos dados.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-blue-700">Postagens da Semana</h2>
            <p className="text-2xl font-bold">13</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-green-700">Alcance Total</h2>
            <p className="text-2xl font-bold">3.500</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-purple-700">Frequência Ideal</h2>
            <p className="text-lg">3 posts por semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">📈 Alcance por Dia</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataDesempenho}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="alcance" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">📊 Postagens por Dia</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dataDesempenho}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border rounded-xl p-4 mt-6 shadow-md">
        <h3 className="text-md font-semibold mb-1">💡 Dica do Dia</h3>
        <p className="text-gray-700 italic">“Quem mede, melhora. Use os dados para ajustar sua estratégia semanal.”</p>
      </div>
    </div>
  );
}
