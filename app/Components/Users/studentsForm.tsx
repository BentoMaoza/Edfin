'use client'

import React, { useState } from 'react'
import { X, Plus, User, BookOpen, Phone, Home } from 'lucide-react'

interface StudentsFormProps {
  onClose: () => void
  onAdd: (student: any) => void
}

const StudentsForm: React.FC<StudentsFormProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('')
  const [className, setClassName] = useState('1ª Classe')
  const [guardianName, setGuardianName] = useState('')
  const [phone, setPhone] = useState('')
  const [tuition, setTuition] = useState('5000')
  const [transport, setTransport] = useState('1000')
  const [usesTransport, setUsesTransport] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!name.trim() || !className.trim() || !guardianName.trim() || !phone.trim()) {
      setError('Todos os campos são obrigatórios')
      setIsLoading(false)
      return
    }

    if (phone.length < 7) {
      setError('Telefone inválido (mínimo 7 dígitos)')
      setIsLoading(false)
      return
    }

    try {
      const newStudent = {
        id: Date.now(),
        name: name.trim(),
        class: className,
        guardianName: guardianName.trim(),
        phone: phone.trim(),
        tuition: parseInt(tuition) || 0,
        transport: usesTransport ? parseInt(transport) || 0 : 0,
        usesTransport,
        registrationFee: false,
        paidTuitionMonths: [],
        paidTransportMonths: [],
      }

      onAdd(newStudent)
      setName('')
      setGuardianName('')
      setPhone('')
      setTuition('5000')
      setTransport('1000')
      setUsesTransport(true)
    } catch (err) {
      setError('Erro ao adicionar aluno')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const classes = ['1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', '5ª Classe', '6ª Classe', '7ª Classe', '8ª Classe', '9ª Classe', '10ª Classe', '11ª Classe', '12ª Classe']

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center'>
          <h2 className='text-2xl font-bold flex items-center gap-2'>
            <Plus size={24} /> Registar Aluno
          </h2>
          <button onClick={onClose} className='p-1 hover:bg-blue-700 rounded-lg transition'>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 font-semibold text-sm'>{error}</p>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Nome do Aluno *</label>
            <div className='relative'>
              <User className='absolute left-3 top-3.5 text-gray-400' size={18} />
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='João Silva'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Classe *</label>
            <div className='relative'>
              <BookOpen className='absolute left-3 top-3.5 text-gray-400' size={18} />
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none'
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Nome do Encarregado *</label>
            <div className='relative'>
              <Home className='absolute left-3 top-3.5 text-gray-400' size={18} />
              <input
                type='text'
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder='Maria Silva'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Telefone do Encarregado *</label>
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
            <label className='block text-sm font-medium text-gray-700 mb-1'>Mensalidade (MT) *</label>
            <input
              type='number'
              value={tuition}
              onChange={(e) => setTuition(e.target.value)}
              placeholder='5000'
              min='0'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
            />
          </div>

          <div>
            <label className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition'>
              <input
                type='checkbox'
                checked={usesTransport}
                onChange={(e) => setUsesTransport(e.target.checked)}
                className='w-4 h-4 accent-blue-600 rounded'
              />
              <span className='text-sm font-medium text-gray-700'>Utiliza transporte escolar</span>
            </label>
          </div>

          {usesTransport && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Transporte (MT) *</label>
              <input
                type='number'
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                placeholder='1000'
                min='0'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
              />
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-6'
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Aluno'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentsForm
