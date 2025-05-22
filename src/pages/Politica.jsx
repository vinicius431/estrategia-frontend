import React from 'react';

export default function Politica() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
      <p className="mb-4">
        A presente Política de Privacidade tem como objetivo esclarecer como coletamos, usamos e protegemos os dados dos usuários do SaaS <strong>EstrategIA</strong>.
      </p>
      <p className="mb-2">
        Ao utilizar nossa plataforma, você concorda com a coleta e uso de informações conforme descrito nesta política.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Dados Coletados</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Nome, e-mail e senha para cadastro e login.</li>
        <li>Dados de uso da plataforma para personalização de conteúdo.</li>
        <li>Dados fornecidos voluntariamente em formulários e perfis conectados (como Instagram).</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso das Informações</h2>
      <p className="mb-4">
        Utilizamos os dados para:
        <ul className="list-disc ml-6">
          <li>Personalizar sua experiência com IA.</li>
          <li>Gerar conteúdo estratégico para redes sociais.</li>
          <li>Enviar notificações e comunicados.</li>
        </ul>
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Compartilhamento</h2>
      <p className="mb-4">
        Não vendemos ou compartilhamos seus dados com terceiros, exceto quando exigido por lei ou para garantir a segurança da plataforma.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Segurança</h2>
      <p className="mb-4">
        Adotamos práticas seguras de armazenamento, autenticação e criptografia para proteger suas informações.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Exclusão de Dados</h2>
      <p className="mb-4">
        Você pode solicitar a exclusão dos seus dados a qualquer momento através da página: <a href="/exclusao" className="text-blue-600 underline">/exclusao</a>
      </p>
      <p className="mt-6 text-sm text-gray-500">
        Última atualização: Maio de 2025
      </p>
    </div>
  );
}
