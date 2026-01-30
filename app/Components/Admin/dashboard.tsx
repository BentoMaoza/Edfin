'use client'

import React, { useState } from 'react'
import { LogOut, CheckSquare, X, Eye } from 'lucide-react'

export interface School {
  id: number
  schoolName: string
  nuit: string
  address?: string
  contactPerson?: string
  phone?: string
  email: string
  createdAt: string
  validated: boolean
  active: boolean
}

interface DashboardProps {
  onLogout: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<School[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingSchools')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const handleValidateUser = (id: number) => {
    const updated = users.map(user =>
      user.id === id ? { ...user, validated: true, active: true } : user
    )
    setUsers(updated)
    localStorage.setItem('pendingSchools', JSON.stringify(updated))
  }

  const handleToggleUserStatus = (id: number) => {
    const updated = users.map(user =>
      user.id === id ? { ...user, active: !user.active } : user
    )
    setUsers(updated)
    localStorage.setItem('pendingSchools', JSON.stringify(updated))
  }

  const unvalidatedCount = users.filter(u => !u.validated).length
  const inactiveCount = users.filter(u => !u.active).length

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Painel Admin</h1>
            <p className='text-blue-100 mt-1'>Gerenciamento de contas</p>
          </div>
          <button
            onClick={onLogout}
            className='flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition'
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'>
            <p className='text-gray-600 text-sm font-medium'>Total de Contas</p>
            <p className='text-3xl font-bold text-gray-800 mt-2'>{users.length}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500'>
            <p className='text-gray-600 text-sm font-medium'>Aguardando Validação</p>
            <p className='text-3xl font-bold text-yellow-600 mt-2'>{unvalidatedCount}</p>
          </div>
          <div className='bg-white rounded-lg shadow p-6 border-l-4 border-red-500'>
            <p className='text-gray-600 text-sm font-medium'>Contas Inativas</p>
            <p className='text-3xl font-bold text-red-600 mt-2'>{inactiveCount}</p>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='px-6 py-4 bg-gray-50 border-b'>
            <h2 className='text-xl font-bold text-gray-800'>Contas de Usuários</h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-100 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Nome da Escola</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>NUIT</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Email</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Data de Criação</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Status</th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='border-b hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 font-medium text-gray-800'>{user.schoolName}</td>
                    <td className='px-6 py-4 text-gray-600'>{user.nuit}</td>
                    <td className='px-6 py-4 text-gray-600'>{user.email}</td>
                    <td className='px-6 py-4 text-gray-600 text-sm'>{user.createdAt}</td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2'>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.validated
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.validated ? '✓ Validado' : '⏳ Pendente'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.active
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.active ? '✓ Ativo' : '✗ Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2'>
                        {!user.validated && (
                          <button
                            onClick={() => handleValidateUser(user.id)}
                            className='flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition'
                            title='Validar conta'
                          >
                            <CheckSquare size={16} />
                            Validar
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition ${
                            user.active
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                          title={user.active ? 'Desativar' : 'Ativar'}
                        >
                          {user.active ? (
                            <>
                              <X size={16} />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye size={16} />
                              Ativar
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
