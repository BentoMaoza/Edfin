'use client'

import React, { useState } from 'react'
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const SchoolSignup = () => {
  const [schoolName, setSchoolName] = useState('')
  const [nuit, setNuit] = useState('')
  const [address, setAddress] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    // Validações básicas
    if (!schoolName.trim()) {
      setError('Nome da escola é obrigatório')
      setIsLoading(false)
      return
    }
    if (!nuit.trim()) {
      setError('NUIT é obrigatório')
      setIsLoading(false)
      return
    }
    if (!email.includes('@')) {
      setError('Email inválido')
      setIsLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      setIsLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    await new Promise((r) => setTimeout(r, 500))

    try {
      const existing = JSON.parse(localStorage.getItem('pendingSchools') || '[]')
      if (existing.some((s: any) => s.email === email || s.nuit === nuit)) {
        setError('Já existe uma solicitação com este email ou NUIT')
        setIsLoading(false)
        return
      }

      const newSchool = {
        id: Date.now(),
        schoolName,
        nuit,
        address,
        contactPerson,
        phone,
        email,
        password,
        createdAt: new Date().toISOString().split('T')[0],
        validated: false,
        active: false,
      }

      existing.push(newSchool)
      localStorage.setItem('pendingSchools', JSON.stringify(existing))

      setSuccess(true)
      setSchoolName('')
      setNuit('')
      setAddress('')
      setContactPerson('')
      setPhone('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Erro ao enviar solicitação. Tente novamente.')
    }

    setIsLoading(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
      <div className='bg-white/10 backdrop-blur-md bg-clip-padding rounded-xl shadow-2xl p-8 max-w-lg w-full border border-white/20'>
        <div className='text-center mb-6'>
          <div className='inline-block bg-green-600 rounded-full p-3 mb-4'>
            <User className='text-white' size={28} />
          </div>
          <h1 className='text-2xl font-bold text-white mb-1'>Cadastro de Escola</h1>
          <p className='text-gray-200 text-sm'>Solicite acesso ao sistema — a administração aprovará.</p>
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
            <div className='text-sm text-green-200'>Solicitação enviada! Aguarde aprovação do admin.</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-200 mb-1'>Nome da Escola</label>
            <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' required />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-200 mb-1'>NUIT</label>
            <input value={nuit} onChange={(e) => setNuit(e.target.value)} className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' required />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-200 mb-1'>Endereço</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-200 mb-1'>Pessoa de Contato</label>
            <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-200 mb-1'>Telefone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-200 mb-1'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 text-gray-400' size={16} />
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' required />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-200 mb-1'>Senha</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 text-gray-400' size={16} />
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' required />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-200 mb-1'>Confirmar Senha</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 text-gray-400' size={16} />
                <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 bg-white/6 text-white' required />
              </div>
            </div>
          </div>

          <button type='submit' disabled={isLoading} className={`w-full py-2 rounded-md text-white font-semibold ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
            {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>

        <div className='mt-4 text-center text-sm'>
          <p className='text-gray-200'>Já tens conta? <Link href='/login' className='text-blue-400 font-semibold'>Entrar</Link></p>
        </div>

      </div>
    </div>
  )
}

export default SchoolSignup
