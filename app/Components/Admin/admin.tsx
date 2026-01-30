'use client'

import React, { useState } from 'react'
import { Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import Lgitink from 'next/link'
import Link from 'next/link'
import Dashboard from './dashboard'

interface User {
  id: number
  name: string
  email: string
  createdAt: string
  validated: boolean
  active: boolean
}

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const ADMIN_USERNAME = 'Bento'
  const ADMIN_PASSWORD = 'Edfin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    // Simular delay de requisição
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setSuccess(true)
      setIsLoggedIn(true)
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } else {
      setError('Nome de usuário ou senha incorretos')
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  // Dashboard Admin
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />
  }

  // Formulário de login
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-2xl p-8 max-w-md w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-blue-600 rounded-full p-3 mb-4'>
            <Lock className='text-white' size={32} />
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Admin Login</h1>
          <p className='text-gray-600'>Acesso restrito ao painel de gestão</p>
        </div>

        {/* Mensagens */}
        {error && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
            <AlertCircle className='text-red-600 flex-shrink-0 mt-0.5' size={20} />
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
        )}

        {success && (
          <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3'>
            <CheckCircle className='text-green-600 flex-shrink-0 mt-0.5' size={20} />
            <p className='text-green-700 text-sm'>Login realizado com sucesso!</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Username */}
          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
              Nome de Usuário
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 text-gray-400' size={20} />
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Digite seu usuário'
                className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              Senha
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-gray-400' size={20} />
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Digite sua senha'
                className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition-colors duration-300 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        {/* Demo Info */}
        <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
          <p className='text-xs text-blue-700 font-semibold mb-2'>📝 Credenciais de Teste:</p>
          <p className='text-xs text-blue-600'>Usuário: <span className='font-mono font-semibold'>Bento</span></p>
          <p className='text-xs text-blue-600'>Senha: <span className='font-mono font-semibold'>Edfin</span></p>
        </div>

        {/* Footer */}
        <p className='text-center text-xs text-gray-500 mt-6'>
          Sistema de gestão | © 2026 Edfin
        </p>
        
        <div className='mt-6 pt-6 border-t border-gray-200'>
          <p className='text-center text-gray-600 text-sm'>
            Ainda não tem conta?{' '}
            <Link href='/signup' className='text-green-600 hover:text-green-700 font-semibold'>
              Criar Conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
