'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      setErro(error.message)
      return
    }

    const userId = data.user?.id
    if (userId) {
      const { error: insertError } = await supabase.from('usuarios').insert([
        { id: userId, nome }
      ])

      if (insertError) {
        setErro('Erro ao salvar nome do usuário.')
        return
      }
    }

    router.push('/')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegistro} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          Registrar
        </button>
      </form>
    </div>
  )
}
