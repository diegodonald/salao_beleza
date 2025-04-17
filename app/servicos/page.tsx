const servicos = [
    { nome: "Corte", duracao: 30 },
    { nome: "Barba", duracao: 20 },
    { nome: "Pintura", duracao: 45 },
  ];
  
  export default function Servicos() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Serviços Disponíveis</h2>
        <ul className="space-y-2">
          {servicos.map((servico, i) => (
            <li key={i} className="bg-white p-4 shadow rounded-md">
              <strong>{servico.nome}</strong> – {servico.duracao} minutos
            </li>
          ))}
        </ul>
      </div>
    );
  }
  