import React from 'react';

export default function Termos() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Termos de Uso</h1>
      <p className="mb-4">
        Estes Termos de Uso regem a utilização da plataforma <strong>EstrategIA</strong> por parte dos usuários.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Aceitação</h2>
      <p className="mb-4">
        Ao utilizar o EstrategIA, você concorda com os presentes termos e se compromete a cumprir todas as condições aqui estabelecidas.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Cadastro</h2>
      <p className="mb-4">
        Para utilizar os serviços, é necessário criar uma conta com dados verdadeiros. Você é responsável por manter suas credenciais seguras.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Uso da Plataforma</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Não é permitido o uso da plataforma para fins ilícitos.</li>
        <li>É proibida a redistribuição do conteúdo gerado sem autorização.</li>
        <li>A IA da plataforma pode ter limitações e não garante resultados.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Cancelamento e Restrições</h2>
      <p className="mb-4">
        Podemos suspender ou encerrar o acesso de usuários que violem estes termos ou causem danos à plataforma.
      </p>
      <p className="mt-6 text-sm text-gray-500">
        Última atualização: Maio de 2025
      </p>
    </div>
  );
}
