'use client'

import React, { useState } from 'react'
import { LogOut, CheckSquare, X, Eye, Users, Clock, UserX, UserCheck, Menu } from 'lucide-react'

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

  const [view, setView] = useState<'all' | 'pending' | 'blocked'>('all')
  const [selected, setSelected] = useState<School | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const listForView = () => {
    if (view === 'pending') return users.filter(u => !u.validated)
    if (view === 'blocked') return users.filter(u => !u.active)
    return users
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <button className='md:hidden p-2 rounded bg-blue-700/30' onClick={() => setIsSidebarOpen(true)}>
              <Menu />
            </button>
            <div>
              <h1 className='text-3xl font-bold'>Painel Admin</h1>
              <p className='text-blue-100 mt-1'>Gerenciamento de escolas</p>
            </div>
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

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Sidebar */}
        <aside className='hidden md:block md:col-span-1 bg-white/6 backdrop-blur rounded-lg p-4 border border-white/10'>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-800'>Navegação</h2>
          </div>
          <nav className='flex flex-col gap-2'>
            <button onClick={() => { setView('all'); setSelected(null) }} className={`text-left px-3 py-2 rounded ${view==='all'?'bg-blue-600 text-white':'hover:bg-gray-50'}`}>
              Todas as Contas <span className='ml-2 text-sm font-medium text-gray-700'>({users.length})</span>
            </button>
            <button onClick={() => { setView('pending'); setSelected(null) }} className={`text-left px-3 py-2 rounded ${view==='pending'?'bg-yellow-400 text-white':'hover:bg-gray-50'}`}>
              Solicitações <span className='ml-2 text-sm font-medium text-gray-700'>({unvalidatedCount})</span>
            </button>
            <button onClick={() => { setView('blocked'); setSelected(null) }} className={`text-left px-3 py-2 rounded ${view==='blocked'?'bg-red-500 text-white':'hover:bg-gray-50'}`}>
              Bloqueados <span className='ml-2 text-sm font-medium text-gray-700'>({inactiveCount})</span>
            </button>
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex'>
            <div className='w-full bg-white/95 p-4 overflow-auto'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold'>Navegação</h2>
                <button onClick={() => setIsSidebarOpen(false)} className='p-2 rounded-md'>
                  <X />
                </button>
              </div>
              <nav className='flex flex-col gap-2'>
                <button onClick={() => { setView('all'); setSelected(null); setIsSidebarOpen(false) }} className={`text-left px-3 py-2 rounded ${view==='all'?'bg-blue-600 text-white':'hover:bg-gray-50'}`}>
                  <Users className='inline mr-2' /> Todas as Contas <span className='ml-2 text-sm font-medium text-gray-700'>({users.length})</span>
                </button>
                <button onClick={() => { setView('pending'); setSelected(null); setIsSidebarOpen(false) }} className={`text-left px-3 py-2 rounded ${view==='pending'?'bg-yellow-400 text-white':'hover:bg-gray-50'}`}>
                  <Clock className='inline mr-2' /> Solicitações <span className='ml-2 text-sm font-medium text-gray-700'>({unvalidatedCount})</span>
                </button>
                <button onClick={() => { setView('blocked'); setSelected(null); setIsSidebarOpen(false) }} className={`text-left px-3 py-2 rounded ${view==='blocked'?'bg-red-500 text-white':'hover:bg-gray-50'}`}>
                  <UserX className='inline mr-2' /> Bloqueados <span className='ml-2 text-sm font-medium text-gray-700'>({inactiveCount})</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* List + Detail */}
        <main className='md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <section className='col-span-1'>
            <div className='bg-white rounded-lg shadow p-4'>
              <h3 className='text-lg font-semibold mb-3'>Lista</h3>
              <div className='divide-y'>
                {listForView().length === 0 && <p className='text-sm text-gray-500 p-4'>Nenhuma escola encontrada.</p>}
                {listForView().map(s => (
                  <div key={s.id} className='p-3 hover:bg-gray-50 flex justify-between items-center'>
                    <div>
                      <button className='text-left flex items-center gap-2' onClick={() => setSelected(s)}>
                        {/* status icon */}
                        {(!s.active) ? (
                          <UserX size={16} className='text-red-500' />
                        ) : s.validated ? (
                          <UserCheck size={16} className='text-green-600' />
                        ) : (
                          <Clock size={16} className='text-yellow-500' />
                        )}
                        <div>
                          <p className={`font-medium ${!s.active ? 'text-red-700' : 'text-gray-800'}`}>{s.schoolName}</p>
                          <p className='text-xs text-gray-500'>{s.email} • {s.nuit}</p>
                        </div>
                      </button>
                    </div>
                    <div className='flex gap-2'>
                      {!s.validated && (
                        <button onClick={() => handleValidateUser(s.id)} title='Validar' className='flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm'>
                          <CheckSquare size={14} />
                          Validar
                        </button>
                      )}
                      <button onClick={() => handleToggleUserStatus(s.id)} className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${s.active ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                        {s.active ? (
                          <>
                            <X size={14} />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Eye size={14} />
                            Ativar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className='col-span-1'>
            <div className='bg-white rounded-lg shadow p-4 min-h-[200px]'>
              <h3 className='text-lg font-semibold mb-3'>Detalhes</h3>
              {!selected && <p className='text-sm text-gray-500'>Clique numa escola à esquerda para ver os detalhes.</p>}
              {selected && (
                <div className='space-y-2'>
                  <p><strong>Nome:</strong> {selected.schoolName}</p>
                  <p><strong>NUIT:</strong> {selected.nuit}</p>
                  <p><strong>Email:</strong> {selected.email}</p>
                  <p><strong>Contato:</strong> {selected.contactPerson || '—'}</p>
                  <p><strong>Telefone:</strong> {selected.phone || '—'}</p>
                  <p><strong>Endereço:</strong> {selected.address || '—'}</p>
                  <p><strong>Registro:</strong> {selected.createdAt}</p>
                  <p><strong>Status:</strong> {selected.validated ? 'Validado' : 'Pendente'} / {selected.active ? 'Ativo' : 'Inativo'}</p>

                  <div className='flex gap-2 mt-3'>
                    {!selected.validated && (
                      <button onClick={() => { handleValidateUser(selected.id); setSelected({ ...selected, validated: true, active: true }) }} className='bg-green-600 text-white px-3 py-1 rounded'>Validar</button>
                    )}
                    <button onClick={() => { handleToggleUserStatus(selected.id); setSelected({ ...selected, active: !selected.active }) }} className={`px-3 py-1 rounded ${selected.active ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {selected.active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
