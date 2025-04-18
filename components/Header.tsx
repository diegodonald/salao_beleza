'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const router = useRouter()

  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null)
  const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false)

  useEffect(() => {
    const buscarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        console.log('Usuário autenticado:', user.id)
        setUsuarioLogado(true)

        const { data, error } = await supabase
          .from('usuarios')
          .select('nome')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          console.log('Nome encontrado:', data.nome)
          setNomeUsuario(data.nome)
        } else {
          console.warn('Nome não encontrado ou erro ao buscar:', error)
        }
      } else {
        console.log('Nenhum usuário logado.')
        setUsuarioLogado(false)
      }
    }

    buscarUsuario()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-gray-100 p-4 shadow-sm flex justify-end">
      {usuarioLogado ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-800 font-medium">
            {nomeUsuario ? `Olá, ${nomeUsuario}` : 'Carregando...'}
          </span>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline text-sm"
          >
            Sair
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Você não está logado</span>
      )}
    </header>
  )
}
