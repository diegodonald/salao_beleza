'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface Agendamento {
  id: string
  servico: string
  data_hora: string
}

export default function ReservasPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
        carregarAgendamentos(data.user.id)
      } else {
        router.push('/login')
      }
    })
  }, [])

  const carregarAgendamentos = async (userId: string) => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('user_id', userId)
      .order('data_hora', { ascending: true })

    if (!error && data) {
      setAgendamentos(data)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Minhas Reservas</h2>
      {agendamentos.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum agendamento encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {agendamentos.map(ag => (
            <li key={ag.id} className="border p-4 rounded-md">
              <strong>Serviço:</strong> {ag.servico} <br />
              <strong>Data:</strong> {new Date(ag.data_hora).toLocaleDateString()} <br />
              <strong>Hora:</strong> {new Date(ag.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
