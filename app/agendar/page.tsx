'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

const servicos = [
  { nome: "Corte", duracao: 30 },
  { nome: "Barba", duracao: 20 },
  { nome: "Pintura", duracao: 45 },
];

export default function AgendarPage() {
  const router = useRouter()
  const [servico, setServico] = useState(servicos[0].nome)
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [user, setUser] = useState<any>(null)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
      } else {
        router.push('/login')
      }
    })
  }, [])

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const dataHora = new Date(`${data}T${hora}:00`)
    const { error } = await supabase.from('agendamentos').insert({
      user_id: user.id,
      servico,
      data_hora: dataHora
    })

    if (error) {
      setMensagem("Erro ao agendar. Tente novamente.")
    } else {
      setMensagem("Agendamento realizado com sucesso!")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Agendar horário</h2>
      <form onSubmit={handleAgendar} className="space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={servico}
          onChange={e => setServico(e.target.value)}
        >
          {servicos.map((s, i) => (
            <option key={i} value={s.nome}>{s.nome} – {s.duracao} min</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={data}
          onChange={e => setData(e.target.value)}
          required
        />
        <input
          type="time"
          className="w-full p-2 border rounded"
          value={hora}
          onChange={e => setHora(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Confirmar Agendamento
        </button>
      </form>
      {mensagem && <p className="mt-4 text-center text-green-600">{mensagem}</p>}
    </div>
  )
}
