'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import Modal from 'react-modal'

// ✅ Importando Bootstrap e tema do FullCalendar
import 'bootstrap/dist/css/bootstrap.min.css'

const servicosDisponiveis = [
  { nome: 'Corte', duracao: 30 },
  { nome: 'Barba', duracao: 20 },
  { nome: 'Pintura', duracao: 45 },
  { nome: 'Lavagem', duracao: 15 },
]

export default function AgendarPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null)
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([])
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement(document.body)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
      } else {
        router.push('/login')
      }
    })
  }, [])

  const abrirModal = (arg: any) => {
    setDataSelecionada(arg.date)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setServicosSelecionados([])
    setMensagem('')
  }

  const alternarServico = (nome: string) => {
    setServicosSelecionados((prev) =>
      prev.includes(nome)
        ? prev.filter((s) => s !== nome)
        : [...prev, nome]
    )
  }

  const calcularDuracaoTotal = () => {
    return servicosSelecionados.reduce((total, nome) => {
      const servico = servicosDisponiveis.find((s) => s.nome === nome)
      return total + (servico?.duracao || 0)
    }, 0)
  }

  const confirmarAgendamento = async () => {
    if (!dataSelecionada || servicosSelecionados.length === 0 || !user) return

    const duracaoTotal = calcularDuracaoTotal()
    const inicio = new Date(dataSelecionada)
    const fim = new Date(inicio.getTime() + duracaoTotal * 60000)

    const { error } = await supabase.from('agendamentos').insert({
      user_id: user.id,
      servico: servicosSelecionados.join(', '),
      data_hora: inicio,
      fim: fim
    })

    if (error) {
      setMensagem("Erro ao agendar. Tente novamente.")
    } else {
      setMensagem("Agendamento realizado com sucesso!")
      setTimeout(() => {
        fecharModal()
      }, 1500)
    }
  }

  return (
    <div className="p-4 bg-pink-50 min-h-screen relative z-0">
      <h1 className="text-2xl font-bold text-rose-600 mb-4 text-center">Agendar Atendimento</h1>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
        themeSystem="bootstrap5"
        initialView="timeGridWeek"
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        dateClick={abrirModal}
        locale="pt-br"
        height="auto"
      />

      <Modal
        isOpen={modalAberto}
        onRequestClose={fecharModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
          },
          content: {
            position: 'relative',
            inset: 'unset',
            margin: 'auto',
            maxWidth: '500px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: 10000,
          },
        }}
      >
        <h2 className="text-lg font-bold mb-2 text-rose-600">Selecionar serviços</h2>
        <p className="text-sm text-gray-600 mb-4">
          {dataSelecionada?.toLocaleString()}
        </p>

        <div className="space-y-2">
          {servicosDisponiveis.map((servico) => (
            <label key={servico.nome} className="block">
              <input
                type="checkbox"
                value={servico.nome}
                checked={servicosSelecionados.includes(servico.nome)}
                onChange={() => alternarServico(servico.nome)}
                className="mr-2"
              />
              {servico.nome} ({servico.duracao} min)
            </label>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-700">
          Duração total: <strong>{calcularDuracaoTotal()} min</strong>
        </p>

        {mensagem && (
          <p className="mt-2 text-center text-green-600 font-medium">{mensagem}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={fecharModal}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={confirmarAgendamento}
            className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {/* CSS adicional para garantir que o calendário fique abaixo do modal */}
      <style jsx global>{`
        .fc {
          z-index: 1 !important;
          position: relative;
        }
      `}</style>
    </div>
  )
}
