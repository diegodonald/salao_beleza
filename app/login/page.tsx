'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    })

    if (error) {
      setErro('Email ou senha inválidos.')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Campo de senha com botão de olho */}
        <div className="relative">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="w-full p-2 border rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            tabIndex={-1}
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Entrar
        </button>
      </form>

      <p className="mt-4 text-center">
        Ainda não tem conta?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
