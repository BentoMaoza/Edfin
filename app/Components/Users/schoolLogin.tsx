'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Lock, CheckCircle, AlertCircle, LogOut } from 'lucide-react'

const SchoolLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [school, setSchool] = useState<any | null>(null)

  useEffect(() => {
    // tentar restaurar sessão
    const saved = localStorage.getItem('schoolLoggedIn')
    if (saved) {
      try {
        setSchool(JSON.parse(saved))
      } catch (_) {}
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 400))

    try {
      const stored = JSON.parse(localStorage.getItem('pendingSchools') || '[]')
      const found = stored.find((s: any) => s.email === email && s.password === password)

      if (!found) {
        setError('Credenciais inválidas')
        setIsLoading(false)
        return
      }

      if (!found.validated) {
        setError('Conta ainda não validada pelo administrador')
        setIsLoading(false)
        return
      }

      if (!found.active) {
        setError('Conta desativada. Contate o administrador')
        setIsLoading(false)
        return
      }

      // login bem-sucedido
      setSuccess(true)
      setSchool(found)
      localStorage.setItem('schoolLoggedIn', JSON.stringify(found))
      setEmail('')
      setPassword('')
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError('Erro ao autenticar. Tente novamente.')
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    setSchool(null)
    localStorage.removeItem('schoolLoggedIn')
  }

  if (school) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
        <div className='bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md w-full border border-white/20'>
          <div className='text-center mb-6'>
            <div className='inline-block bg-blue-600 rounded-full p-3 mb-4'>
              <CheckCircle className='text-white' size={28} />
            </div>
            <h2 className='text-2xl font-bold text-white'>Bem-vindo, {school.schoolName}</h2>
            <p className='text-gray-200 text-sm mt-1'>Acesso concedido</p>
          </div>

          <div className='mb-4'>
            <p className='text-sm text-gray-100'>NUIT: <span className='font-medium'>{school.nuit}</span></p>
            <p className='text-sm text-gray-100'>Email: <span className='font-medium'>{school.email}</span></p>
            <p className='text-sm text-gray-100'>Registrada em: <span className='font-medium'>{school.createdAt}</span></p>
          </div>

          <button onClick={handleLogout} className='w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md'>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
      <div className='bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md w-full border border-white/20'>
        <div className='text-center mb-6'>
          <div className='inline-block bg-blue-600 rounded-full p-3 mb-4'>
            <Mail className='text-white' size={28} />
          </div>
          <h1 className='text-2xl font-bold text-white mb-1'>Login — Escola</h1>
          <p className='text-gray-200 text-sm'>Entre com seu email e senha</p>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-900/30 border border-red-700/40 rounded flex items-start gap-3'>
            <AlertCircle className='text-red-200' size={18} />
            <div className='text-sm text-red-200'>{error}</div>
          </div>
        )}

        {success && (
          <div className='mb-4 p-3 bg-green-900/30 border border-green-700/40 rounded flex items-start gap-3'>
            <CheckCircle className='text-green-200' size={18} />
            <div className='text-sm text-green-200'>Autenticado com sucesso</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-200 mb-1'>Email</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 text-gray-300' size={16} />
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white/6 text-white' required />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-200 mb-1'>Senha</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-gray-300' size={16} />
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white/6 text-white' required />
            </div>
          </div>

          <button type='submit' disabled={isLoading} className={`w-full py-2 rounded-md text-white font-semibold ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className='mt-4 text-center text-sm'>
          <p className='text-gray-200'>Ainda não solicitou acesso? Crie uma conta em breve: <span className='font-semibold'>/signup</span></p>
        </div>
      </div>
    </div>
  )
}

export default SchoolLogin
