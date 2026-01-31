'use client'

import React, { useState } from 'react'
import { Mail, Lock, School, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const SchoolLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Email e senha são obrigatórios')
        setLoading(false)
        return
      }

      const schoolsData = localStorage.getItem('pendingSchools')
      if (!schoolsData) {
        setError('Nenhuma escola registada')
        setLoading(false)
        return
      }

      const schools = JSON.parse(schoolsData)
      const school = schools.find((s: any) => s.email === email && s.password === password)

      if (!school) {
        setError('Email ou senha incorretos')
        setLoading(false)
        return
      }

      if (!school.validated) {
        setError('Sua escola ainda não foi validada pelo administrador. Aguarde aprovação.')
        setLoading(false)
        return
      }

      if (!school.active) {
        setError('Sua conta foi desativada. Contate o administrador.')
        setLoading(false)
        return
      }

      localStorage.setItem('schoolLoggedIn', JSON.stringify({
        id: school.id,
        schoolName: school.schoolName,
        email: school.email,
        nuit: school.nuit,
      }))

      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/school/dashboard'
      }, 1500)
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8'>
      <div className='absolute top-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl'></div>
      <div className='absolute bottom-20 left-10 w-52 h-52 bg-blue-300/20 rounded-full blur-3xl'></div>

      <div className='relative z-10 w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-8 text-center'>
            <div className='flex justify-center mb-4'>
              <School size={40} />
            </div>
            <h1 className='text-3xl font-bold'>Login da Escola</h1>
            <p className='text-blue-100 mt-2'>Acesse o painel de controle</p>
          </div>

          <div className='px-8 py-8'>
            {success && (
              <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-green-800 font-semibold'>Login realizado com sucesso!</p>
                <p className='text-green-700 text-sm mt-1'>Redirecionando para o painel...</p>
              </div>
            )}

            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 font-semibold'>Erro de autenticação</p>
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='escola@exemplo.com'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Senha *</label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3.5 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-6'
              >
                {loading ? 'A fazer login...' : 'Fazer Login'}
              </button>
            </form>

            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-center text-gray-600 text-sm'>
                Ainda não tem conta?{' '}
                <Link href='/signup' className='text-blue-600 hover:text-blue-700 font-semibold'>
                  Registar
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6 text-center text-blue-100 text-sm'>
          <p>© 2026 Sistema de Gestão Escolar. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default SchoolLogin
