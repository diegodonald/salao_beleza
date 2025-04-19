'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const router = useRouter()
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null)
  const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false)

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const { data } = await supabase
          .from('usuarios')
          .select('nome')
          .eq('id', session.user.id)
          .single()

        if (data?.nome) {
          setNomeUsuario(data.nome)
          setUsuarioLogado(true)
        }
      }
    }

    carregarUsuario()

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setNomeUsuario(null)
        setUsuarioLogado(false)
        router.refresh()
      }

      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('usuarios')
          .select('nome')
          .eq('id', session.user.id)
          .single()

        if (data?.nome) {
          setNomeUsuario(data.nome)
          setUsuarioLogado(true)
        }
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-md py-6 px-8 border-b border-pink-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center gap-4">
          <img src="/images/logo.png" alt="Logo do salão" className="h-12 w-auto rounded-md" />
          <span className="text-2xl font-bold text-rose-600">
            Salão Sandra Pipoquinha
          </span>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end md:gap-6 text-rose-600 font-medium text-base">
          <nav className="flex gap-4">
            <Link href="/">Início</Link>
            <Link href="/servicos">Serviços</Link>
            <Link href="/agendar">Agendar</Link>
            <Link href="/reservas">Reservas</Link>
            {!usuarioLogado && <Link href="/login">Login</Link>}
            <Link href="/admin">Painel</Link>
          </nav>

          {usuarioLogado && nomeUsuario && (
            <div className="flex items-center gap-4 text-sm text-pink-800 font-semibold mt-2 md:mt-0">
              <span>Olá, {nomeUsuario}!</span>
              <button
                onClick={handleLogout}
                className="bg-pink-100 hover:bg-pink-200 px-3 py-1 rounded transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
