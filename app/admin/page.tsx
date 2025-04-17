'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface Agendamento {
  id: string
  servico: string
  data_hora: string
  user_id: string
}

export default function AdminPage() {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  useEffect(() => {
    carregarTodosAgendamentos()
  }, [])

  const carregarTodosAgendamentos = async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('data_hora', { ascending: true })

    if (!error && data) {
      setAgendamentos(data)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Agenda da Barbearia</h2>
      {agendamentos.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {agendamentos.map(ag => (
            <li key={ag.id} className="border p-4 rounded-md">
              <strong>Serviço:</strong> {ag.servico} <br />
              <strong>Data:</strong> {new Date(ag.data_hora).toLocaleDateString()} <br />
              <strong>Hora:</strong> {new Date(ag.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
              <strong>Cliente (user_id):</strong> {ag.user_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
