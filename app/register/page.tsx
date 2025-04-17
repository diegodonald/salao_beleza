'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password: senha
    })

    if (error) {
      setErro(error.message)
    } else {
      setMensagem('Cadastro feito com sucesso! Você já pode fazer login.')
      setEmail('')
      setSenha('')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Cadastro</h2>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}
      {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Cadastrar
        </button>
      </form>
      <p className="mt-4 text-center">
        Já tem conta? <Link href="/login" className="text-blue-600 hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
