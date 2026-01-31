'use client'

import React, { useState } from 'react'
import { Mail, Lock, Building2, FileText, Phone, MapPin, User } from 'lucide-react'
import Link from 'next/link'

const SchoolSignup = () => {
  const [schoolName, setSchoolName] = useState('')
  const [nuit, setNuit] = useState('')
  const [address, setAddress] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!schoolName || !nuit || !email || !password || !contactPerson || !phone) {
        setError('Todos os campos são obrigatórios')
        setLoading(false)
        return
      }

      if (phone.length < 7) {
        setError('Telefone inválido (mínimo 7 dígitos)')
        setLoading(false)
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('Email inválido')
        setLoading(false)
        return
      }

      const existingSchools = localStorage.getItem('pendingSchools')
      if (existingSchools) {
        const schools = JSON.parse(existingSchools)
        if (schools.some((s: any) => s.email === email)) {
          setError('Este email já está registado')
          setLoading(false)
          return
        }
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
        createdAt: new Date().toISOString(),
        validated: false,
        active: false,
      }

      const schools = existingSchools ? JSON.parse(existingSchools) : []
      schools.push(newSchool)
      localStorage.setItem('pendingSchools', JSON.stringify(schools))

      setSuccess(true)
      setSchoolName('')
      setNuit('')
      setAddress('')
      setContactPerson('')
      setPhone('')
      setEmail('')
      setPassword('')

      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setError('Erro ao registar. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8'>
      <div className='absolute top-20 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl'></div>
      <div className='absolute bottom-20 right-10 w-52 h-52 bg-blue-300/20 rounded-full blur-3xl'></div>

      <div className='relative z-10 w-full max-w-2xl'>
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-8 text-center'>
            <div className='flex justify-center mb-4'>
              <Building2 size={40} />
            </div>
            <h1 className='text-3xl font-bold'>Registar Escola</h1>
            <p className='text-blue-100 mt-2'>Crie uma conta para sua instituição educacional</p>
          </div>

          <div className='px-8 py-8'>
            {success && (
              <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-green-800 font-semibold'>Registado com sucesso!</p>
                <p className='text-green-700 text-sm mt-1'>Redirecionando para login...</p>
              </div>
            )}

            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 font-semibold'>Erro</p>
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nome da Escola *</label>
                <div className='relative'>
                  <Building2 className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type='text'
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder='Escola Exemplo'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>NUIT *</label>
                <div className='relative'>
                  <FileText className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type='text'
                    value={nuit}
                    onChange={(e) => setNuit(e.target.value)}
                    placeholder='123456789'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Endereço</label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='Rua, Cidade, País'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Pessoa de Contato *</label>
                <div className='relative'>
                  <User className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type='text'
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder='Nome completo'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Telefone *</label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-3.5 text-gray-400' size={18} />
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder='843123456'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

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
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='••••••••'
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2'
              >
                {loading ? 'Registando...' : 'Registar Escola'}
              </button>
            </form>

            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-center text-gray-600 text-sm'>
                Já tem conta?{' '}
                <Link href='/login' className='text-blue-600 hover:text-blue-700 font-semibold'>
                  Faça Login
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

export default SchoolSignup
