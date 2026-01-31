'use client'

import React, { useState } from 'react'
import { X, Plus, CreditCard, DollarSign } from 'lucide-react'

interface PaymentsFormProps {
  onClose: () => void
  onAdd: (payment: any) => void
  students: any[]
}

const PaymentsForm: React.FC<PaymentsFormProps> = ({ onClose, onAdd, students }) => {
  const [studentId, setStudentId] = useState('')
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'tuition' | 'transport' | 'registration'>('tuition')
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'carteira' | 'banco'>('dinheiro')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!studentId || !amount) {
      setError('Seleccione um aluno e insira o montante')
      setIsLoading(false)
      return
    }

    const amountNum = parseInt(amount)
    if (amountNum <= 0) {
      setError('O montante deve ser maior que 0')
      setIsLoading(false)
      return
    }

    try {
      const student = students.find(s => s.id === parseInt(studentId))
      const newPayment = {
        id: Date.now(),
        studentId: parseInt(studentId),
        studentName: student?.name || 'Desconhecido',
        amount: amountNum,
        type,
        paymentMethod,
        date: new Date().toISOString().split('T')[0],
      }

      onAdd(newPayment)
      setStudentId('')
      setAmount('')
      setType('tuition')
      setPaymentMethod('dinheiro')
    } catch (err) {
      setError('Erro ao registar pagamento')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const typeLabels = {
    tuition: 'Mensalidade',
    transport: 'Transporte',
    registration: 'Matrícula',
  }

  const methodLabels = {
    dinheiro: 'Dinheiro',
    carteira: 'Carteira Móvel',
    banco: 'Banco',
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-gradient-to-r from-green-600 to-green-800 text-white p-6 flex justify-between items-center'>
          <h2 className='text-2xl font-bold flex items-center gap-2'>
            <Plus size={24} /> Registar Pagamento
          </h2>
          <button onClick={onClose} className='p-1 hover:bg-green-700 rounded-lg transition'>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 font-semibold text-sm'>{error}</p>
            </div>
          )}

          <div className='relative'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Aluno *</label>
            <input
              type='text'
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setStudentId('') }}
              onFocus={() => setShowSuggestions(true)}
              placeholder='Pesquisar por nome do aluno...'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
            />
            {showSuggestions && query.trim() !== '' && (
              <ul className='absolute z-50 left-0 right-0 bg-white border border-gray-200 mt-1 rounded-md max-h-48 overflow-auto shadow'>
                {students
                  .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
                  .map(s => (
                    <li
                      key={s.id}
                      onClick={() => { setStudentId(String(s.id)); setQuery(s.name); setShowSuggestions(false) }}
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    >
                      <div className='flex justify-between'>
                        <span>{s.name}</span>
                        <span className='text-sm text-gray-500'>{s.class}</span>
                      </div>
                    </li>
                  ))}
                {students.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                  <li className='px-4 py-2 text-sm text-gray-500'>Nenhum aluno encontrado</li>
                )}
              </ul>
            )}
            {/* Hidden select to preserve current value for submission and summary lookup */}
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className='hidden'>
              <option value=''>Seleccione um aluno</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.class})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo de Pagamento *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition appearance-none'
            >
              <option value='tuition'>{typeLabels.tuition}</option>
              <option value='transport'>{typeLabels.transport}</option>
              <option value='registration'>{typeLabels.registration}</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Montante (MT) *</label>
            <div className='relative'>
              <DollarSign className='absolute left-3 top-3.5 text-gray-400' size={18} />
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='0'
                min='0'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Método de Pagamento *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition appearance-none'
            >
              <option value='dinheiro'>{methodLabels.dinheiro}</option>
              <option value='carteira'>{methodLabels.carteira}</option>
              <option value='banco'>{methodLabels.banco}</option>
            </select>
          </div>

          <div className='bg-blue-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-700'>
              <strong>Resumo:</strong>
            </p>
            {studentId && (
              <p className='text-sm text-gray-600 mt-1'>
                Aluno: <strong>{students.find(s => s.id === parseInt(studentId))?.name}</strong>
              </p>
            )}
            {amount && (
              <p className='text-sm text-gray-600'>
                Montante: <strong>{parseInt(amount).toLocaleString('pt-BR')} MT</strong>
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-6'
          >
            {isLoading ? 'Registando...' : 'Registar Pagamento'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentsForm
