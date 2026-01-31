'use client'

import React, { useState, useEffect } from 'react'
import { LogOut, Menu, X, Users, FileText, CreditCard, Plus, Eye, Trash2, CheckCircle, AlertCircle, Download } from 'lucide-react'
import StudentsForm from './studentsForm'
import PaymentsForm from './paymentsForm'

interface Student {
  id: number
  name: string
  class: string
  guardianName: string
  phone: string
  tuition: number
  transport: number
  usesTransport: boolean
  registrationFee: boolean
  paidTuitionMonths: number[] // array de meses pagos [1,2,3...12]
  paidTransportMonths: number[] // array de meses pagos [1,2,3...12]
}

interface Payment {
  id: number
  studentId: number
  studentName: string
  amount: number
  type: 'tuition' | 'transport' | 'registration'
  paymentMethod: 'dinheiro' | 'carteira' | 'banco'
  date: string
}

interface Report {
  id: number
  title: string
  generatedAt: string
  period: 'daily' | 'weekly'
  totalStudents: number
  paidStudents: number
  payments?: Payment[]
}

const SchoolDashboard = () => {
  const [school, setSchool] = useState<any>(null)
  const [view, setView] = useState<'home' | 'students' | 'payments' | 'reports'>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const [students, setStudents] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [reports, setReports] = useState<Report[]>([])

  // Carregar dados da escola ao fazer login
  useEffect(() => {
    const saved = localStorage.getItem('schoolLoggedIn')
    if (saved) {
      try {
        const schoolData = JSON.parse(saved)
        setSchool(schoolData)
        
        // Carregar alunos da escola e migrar formato antigo se necessário
        const schoolStudents = localStorage.getItem(`students_${schoolData.id}`)
        if (schoolStudents) {
          try {
            const parsed = JSON.parse(schoolStudents) as Student[]
            const migrated = parsed.map((s: any) => {
              if (!s.paidTuitionMonths) {
                s.paidTuitionMonths = s.paidTuition ? Array.from({ length: 12 }, (_, i) => i + 1) : []
              }
              if (!s.paidTransportMonths) {
                s.paidTransportMonths = s.paidTransport ? Array.from({ length: 12 }, (_, i) => i + 1) : []
              }
              return s as Student
            })
            setStudents(migrated)
          } catch (_) {
            setStudents(JSON.parse(schoolStudents))
          }
        }
        
        // Carregar pagamentos da escola
        const schoolPayments = localStorage.getItem(`payments_${schoolData.id}`)
        if (schoolPayments) {
          setPayments(JSON.parse(schoolPayments))
        }
        
        // Carregar relatórios da escola
        const schoolReports = localStorage.getItem(`reports_${schoolData.id}`)
        if (schoolReports) {
          setReports(JSON.parse(schoolReports))
        }
      } catch (_) {}
    }
  }, [])

  // Guardar alunos quando mudam
  useEffect(() => {
    if (school) {
      localStorage.setItem(`students_${school.id}`, JSON.stringify(students))
    }
  }, [students, school])

  // Guardar pagamentos quando mudam
  useEffect(() => {
    if (school) {
      localStorage.setItem(`payments_${school.id}`, JSON.stringify(payments))
    }
  }, [payments, school])

  // Guardar relatórios quando mudam
  useEffect(() => {
    if (school) {
      localStorage.setItem(`reports_${school.id}`, JSON.stringify(reports))
    }
  }, [reports, school])

  const handleAddStudent = (newStudent: Student) => {
    setStudents([...students, newStudent])
    setShowStudentForm(false)
  }

  const handleAddPayment = (newPayment: Payment) => {
    setPayments([...payments, newPayment])
    
    // Extrair o mês do ano (1-12) da data
    const paymentDate = new Date(newPayment.date)
    const month = paymentDate.getMonth() + 1 // JavaScript retorna 0-11
    
    const updatedStudents = students.map(s => {
      if (s.id === newPayment.studentId) {
        const newStudent = { ...s }
        if (newPayment.type === 'tuition') {
          // Adicionar mês aos pagos se não estiver já
          if (!newStudent.paidTuitionMonths.includes(month)) {
            newStudent.paidTuitionMonths = [...newStudent.paidTuitionMonths, month]
          }
        }
        if (newPayment.type === 'transport') {
          // Adicionar mês aos pagos se não estiver já
          if (!newStudent.paidTransportMonths.includes(month)) {
            newStudent.paidTransportMonths = [...newStudent.paidTransportMonths, month]
          }
        }
        if (newPayment.type === 'registration') {
          newStudent.registrationFee = true
        }
        return newStudent
      }
      return s
    })
    setStudents(updatedStudents)
    setShowPaymentForm(false)
  }

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id))
    setPayments(payments.filter(p => p.studentId !== id))
    setSelectedStudent(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('schoolLoggedIn')
    window.location.href = '/login'
  }

  // Função para verificar se um aluno deve algo
  const studentOwes = (student: Student): boolean => {
    // Se não pagou matrícula, deve
    if (!student.registrationFee) return true
    
    // Se deve algum mês de mensalidade (todos os 12 meses devem estar pagos)
     if ((student.paidTuitionMonths ?? []).length < 12) return true
    
    // Se usa transporte e deve algum mês (todos os 12 meses devem estar pagos)
     if (student.usesTransport && (student.paidTransportMonths ?? []).length < 12) return true
    
    return false
  }

  // Gera um relatório com todos os pagamentos desde o último relatório gerado
  const handleGenerateReport = () => {
    // Determinar data do último relatório (se existir)
    const lastGeneratedAt = reports.length ? reports.reduce((a, b) => new Date(a.generatedAt) > new Date(b.generatedAt) ? a : b).generatedAt : null
    const sinceDate = lastGeneratedAt ? new Date(lastGeneratedAt) : null

    const includedPayments = sinceDate ? payments.filter(p => new Date(p.date) > sinceDate) : payments.slice()

    const paidStudentsCount = new Set(includedPayments.map(p => p.studentId)).size

    const newReport: Report = {
      id: Date.now(),
      title: `Relatório - ${new Date().toLocaleDateString('pt-BR')}`,
      generatedAt: new Date().toISOString().split('T')[0],
      period: 'daily',
      totalStudents: students.length,
      paidStudents: paidStudentsCount,
      payments: includedPayments,
    }

    setReports([newReport, ...reports])
  }

  const downloadReport = (r: Report) => {
    try {
      const payload = {
        id: r.id,
        title: r.title,
        generatedAt: r.generatedAt,
        period: r.period,
        totalStudents: r.totalStudents,
        paidStudents: r.paidStudents,
        payments: r.payments ?? [],
      }
      const content = JSON.stringify(payload, null, 2)
      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report_${r.id}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Erro ao gerar download do relatório', err)
    }
  }


  const paidStudents = students.filter(s => !studentOwes(s))
  const debtorStudents = students.filter(s => studentOwes(s))
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  if (!school) {
    return <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100'><div className='text-gray-600'>Carregando...</div></div>
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <button className='md:hidden p-2 rounded bg-blue-700/30' onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className='text-3xl font-bold'>{school.schoolName}</h1>
              <p className='text-blue-100 text-sm mt-1'>Bem-vindo ao painel de controle</p>
            </div>
          </div>
          <button onClick={handleLogout} className='flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition'>
            <LogOut size={20} />
            <span className='hidden sm:inline'>Sair</span>
          </button>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
        {/* Sidebar Desktop */}
        <aside className='hidden md:block md:col-span-1 bg-white rounded-lg shadow p-4 h-fit sticky top-24'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <Menu size={20} /> Menu
          </h2>
          <nav className='space-y-2'>
            <button
              onClick={() => setView('home')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                view === 'home'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              📊 Início
            </button>
            <button
              onClick={() => setView('students')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                view === 'students'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Users size={18} /> Alunos ({students.length})
            </button>
            <button
              onClick={() => setView('payments')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                view === 'payments'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CreditCard size={18} /> Pagamentos ({payments.length})
            </button>
            <button
              onClick={() => setView('reports')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                view === 'reports'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FileText size={18} /> Relatórios ({reports.length})
            </button>
            {reports.length > 0 && (
              <div className='mt-2 space-y-1'>
                {reports.slice(0,3).map(r => (
                  <div key={r.id} className='flex items-center justify-between px-3'>
                    <button onClick={() => setView('reports')} className='text-sm text-gray-700 text-left truncate'>
                      {r.title}
                    </button>
                    <button onClick={() => downloadReport(r)} title='Download relatório' className='p-1 rounded hover:bg-gray-100'>
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </nav>

          <hr className='my-4' />

          <h3 className='text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide'>Devedores</h3>
          <div className='space-y-2'>
            <div className='px-3 py-2 rounded-lg bg-red-50 border border-red-200'>
              <p className='text-xs font-semibold text-red-700'>MENSALIDADE</p>
              <p className='text-lg font-bold text-red-600'>{students.filter(s => s.paidTuitionMonths.length < 12).length}</p>
            </div>
            <div className='px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200'>
              <p className='text-xs font-semibold text-yellow-700'>MATRÍCULA</p>
              <p className='text-lg font-bold text-yellow-600'>{students.filter(s => !s.registrationFee).length}</p>
            </div>
            <div className='px-3 py-2 rounded-lg bg-orange-50 border border-orange-200'>
              <p className='text-xs font-semibold text-orange-700'>TRANSPORTE</p>
              <p className='text-lg font-bold text-orange-600'>{students.filter(s => s.usesTransport && s.paidTransportMonths.length < 12).length}</p>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className='fixed inset-0 z-50 bg-black/40 md:hidden flex'>
            <div className='w-full max-w-xs bg-white p-4 overflow-auto'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold text-gray-800'>Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className='p-2 rounded-lg hover:bg-gray-100'>
                  <X size={24} />
                </button>
              </div>
              <nav className='space-y-2'>
                <button
                  onClick={() => { setView('home'); setIsSidebarOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    view === 'home'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Início
                </button>
                <button
                  onClick={() => { setView('students'); setIsSidebarOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                    view === 'students'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Users size={18} /> Alunos ({students.length})
                </button>
                <button
                  onClick={() => { setView('payments'); setIsSidebarOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                    view === 'payments'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <CreditCard size={18} /> Pagamentos ({payments.length})
                </button>
                <button
                  onClick={() => { setView('reports'); setIsSidebarOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                    view === 'reports'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileText size={18} /> Relatórios ({reports.length})
                </button>
                {reports.length > 0 && (
                  <div className='mt-2 space-y-1'>
                    {reports.slice(0,3).map(r => (
                      <div key={r.id} className='flex items-center justify-between px-3'>
                        <button onClick={() => { setView('reports'); setIsSidebarOpen(false) }} className='text-sm text-gray-700 text-left truncate'>
                          {r.title}
                        </button>
                        <button onClick={() => downloadReport(r)} title='Download relatório' className='p-1 rounded hover:bg-gray-100'>
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </nav>

              <hr className='my-4' />

              <h3 className='text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide'>Devedores</h3>
              <div className='space-y-2'>
                <div className='px-3 py-2 rounded-lg bg-red-50 border border-red-200'>
                  <p className='text-xs font-semibold text-red-700'>MENSALIDADE</p>
                  <p className='text-lg font-bold text-red-600'>{students.filter(s => s.paidTuitionMonths.length < 12).length}</p>
                </div>
                <div className='px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200'>
                  <p className='text-xs font-semibold text-yellow-700'>MATRÍCULA</p>
                  <p className='text-lg font-bold text-yellow-600'>{students.filter(s => !s.registrationFee).length}</p>
                </div>
                <div className='px-3 py-2 rounded-lg bg-orange-50 border border-orange-200'>
                  <p className='text-xs font-semibold text-orange-700'>TRANSPORTE</p>
                  <p className='text-lg font-bold text-orange-600'>{students.filter(s => s.usesTransport && s.paidTransportMonths.length < 12).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className='md:col-span-3 space-y-6'>
          {/* HOME */}
          {view === 'home' && (
            <div className='space-y-6'>
              <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8'>
                <h2 className='text-4xl font-bold mb-2'>Bem-vindo, {school.schoolName}!</h2>
                <p className='text-blue-100 text-lg'>Gerencie seus alunos, pagamentos e relatórios de forma eficiente.</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'>
                  <p className='text-gray-600 text-sm font-medium'>Total de Alunos</p>
                  <p className='text-4xl font-bold text-blue-600 mt-2'>{students.length}</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-500'>
                  <p className='text-gray-600 text-sm font-medium'>Alunos Adimplentes</p>
                  <p className='text-4xl font-bold text-green-600 mt-2'>{paidStudents.length}</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6 border-l-4 border-red-500'>
                  <p className='text-gray-600 text-sm font-medium'>Alunos Devedores</p>
                  <p className='text-4xl font-bold text-red-600 mt-2'>{debtorStudents.length}</p>
                </div>
                <div className='bg-white rounded-lg shadow p-6 border-l-4 border-purple-500'>
                  <p className='text-gray-600 text-sm font-medium'>Total Arrecadado</p>
                  <p className='text-3xl font-bold text-purple-600 mt-2'>{totalPaid.toLocaleString('pt-BR')} MT</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <button
                  onClick={() => setShowStudentForm(true)}
                  className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition'
                >
                  <Plus size={24} /> Registar Aluno
                </button>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition'
                >
                  <CreditCard size={24} /> Registar Pagamento
                </button>
                <button onClick={handleGenerateReport} className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition'>
                  <FileText size={24} /> Gerar Relatório
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-800'>Últimos Pagamentos</h3>
                  <div className='space-y-3'>
                    {payments.slice(-3).map(p => (
                      <div key={p.id} className='flex justify-between items-center pb-3 border-b last:border-b-0'>
                        <div>
                          <p className='font-medium text-gray-800'>{p.studentName}</p>
                          <p className='text-xs text-gray-500'>{p.type === 'tuition' ? 'Mensalidade' : p.type === 'transport' ? 'Transporte' : 'Matrícula'}</p>
                        </div>
                        <p className='font-bold text-blue-600'>{p.amount.toLocaleString('pt-BR')} MT</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow p-6'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-800'>Relatórios Recentes</h3>
                  <div className='space-y-3'>
                    {reports.map(r => (
                      <div key={r.id} className='flex justify-between items-center pb-3 border-b last:border-b-0'>
                        <div>
                          <p className='font-medium text-gray-800'>{r.title}</p>
                          <p className='text-xs text-gray-500'>{r.generatedAt}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold'>{r.paidStudents}/{r.totalStudents}</span>
                          <button onClick={() => downloadReport(r)} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition' title='Download relatório'>
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {view === 'students' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Lista de Alunos</h2>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <section className='lg:col-span-2 bg-white rounded-lg shadow p-6'>
                  {students.length === 0 && <p className='text-gray-500 py-4 text-center'>Nenhum aluno registado.</p>}
                  {Array.from(new Set(students.map(s => s.class)))
                    .sort()
                    .map(classe => {
                      const classStudents = students.filter(s => s.class === classe)
                      return (
                        <div key={classe} className='mb-6'>
                          <h3 className='text-lg font-semibold mb-3 text-gray-700 border-b pb-2 uppercase'>{classe} ({classStudents.length})</h3>
                          <div className='divide-y'>
                            {classStudents.map(s => (
                              <div key={s.id} className='py-4 flex justify-between items-start hover:bg-gray-50 px-2 rounded transition'>
                                <div onClick={() => setSelectedStudent(s)} className='cursor-pointer flex-1'>
                                  <p className='font-semibold text-gray-800'>{s.name}</p>
                                  <p className='text-sm text-gray-500'>{s.guardianName} • {s.phone}</p>
                                  <div className='flex gap-2 mt-2'>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
                                      s.paidTuitionMonths.length === 12
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {s.paidTuitionMonths.length === 12 ? 'Pago' : `Deve (${12 - s.paidTuitionMonths.length})`} Mensalidade
                                    </span>
                                    {s.usesTransport && (
                                      <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
                                        s.paidTransportMonths.length === 12
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {s.paidTransportMonths.length === 12 ? 'Pago' : `Deve (${12 - s.paidTransportMonths.length})`} Transporte
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteStudent(s.id)}
                                  className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition'
                                  title='Apagar aluno'
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </section>

                <aside className='bg-white rounded-lg shadow p-6 h-fit sticky top-24'>
                  <h3 className='text-lg font-semibold mb-4 text-gray-800'>Detalhes do Aluno</h3>
                  {!selectedStudent && <p className='text-sm text-gray-500 text-center py-4'>Clique num aluno para ver detalhes.</p>}
                  {selectedStudent && (
                    <div className='space-y-3'>
                      <div className='bg-blue-50 p-3 rounded-lg'>
                        <p className='font-semibold text-gray-800'>{selectedStudent.name}</p>
                        <p className='text-sm text-gray-600'>{selectedStudent.class}</p>
                      </div>
                      <div className='space-y-2 text-sm'>
                        <p><strong>Encarregado:</strong> {selectedStudent.guardianName}</p>
                        <p><strong>Telefone:</strong> {selectedStudent.phone}</p>
                        <p><strong>Mensalidade:</strong> {selectedStudent.tuition.toLocaleString('pt-BR')} MT</p>
                        {selectedStudent.usesTransport && <p><strong>Transporte:</strong> {selectedStudent.transport.toLocaleString('pt-BR')} MT</p>}
                      </div>
                      <hr />
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          {selectedStudent.registrationFee ? <CheckCircle size={18} className='text-green-600' /> : <AlertCircle size={18} className='text-red-600' />}
                          <span className='text-sm'><strong>Matrícula:</strong> {selectedStudent.registrationFee ? 'Paga' : 'Deve'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          {selectedStudent.paidTuitionMonths.length === 12 ? <CheckCircle size={18} className='text-green-600' /> : <AlertCircle size={18} className='text-red-600' />}
                          <span className='text-sm'><strong>Mensalidade:</strong> {selectedStudent.paidTuitionMonths.length}/12 meses</span>
                        </div>
                        {selectedStudent.usesTransport && (
                          <div className='flex items-center gap-2'>
                            {selectedStudent.paidTransportMonths.length === 12 ? <CheckCircle size={18} className='text-green-600' /> : <AlertCircle size={18} className='text-red-600' />}
                            <span className='text-sm'><strong>Transporte:</strong> {selectedStudent.paidTransportMonths.length}/12 meses</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteStudent(selectedStudent.id)}
                        className='w-full mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition'
                      >
                        <Trash2 size={16} /> Apagar Aluno
                      </button>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {view === 'payments' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Pagamentos Registados</h2>
              <div className='bg-white rounded-lg shadow p-6'>
                {payments.length === 0 && <p className='text-gray-500 py-8 text-center'>Nenhum pagamento registado.</p>}
                <div className='divide-y'>
                  {payments.map(p => (
                    <div key={p.id} className='py-4 flex justify-between items-center first:pt-0 last:pb-0'>
                      <div className='flex-1'>
                        <p className='font-semibold text-gray-800'>{p.studentName}</p>
                        <p className='text-sm text-gray-500'>
                          {p.type === 'tuition' ? 'Mensalidade' : p.type === 'transport' ? 'Transporte' : 'Matrícula'} • {p.paymentMethod === 'dinheiro' ? 'Dinheiro' : p.paymentMethod === 'carteira' ? 'Carteira Móvel' : 'Banco'} • {p.date}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold text-blue-600 text-lg'>{p.amount.toLocaleString('pt-BR')} MT</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {view === 'reports' && (
            <div className='space-y-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Relatórios de Pagamentos</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {reports.length === 0 && <p className='text-gray-500 col-span-2 text-center py-8'>Nenhum relatório gerado.</p>}
                {reports.map(r => (
                  <div key={r.id} className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-bold text-gray-800 mb-2'>{r.title}</h3>
                        <p className='text-sm text-gray-500 mb-3'>{r.generatedAt}</p>
                        <div className='flex gap-4 text-sm'>
                          <div>
                            <p className='text-gray-600'>Total de Alunos</p>
                            <p className='font-bold text-lg text-blue-600'>{r.totalStudents}</p>
                          </div>
                          <div>
                            <p className='text-gray-600'>Pagaram</p>
                            <p className='font-bold text-lg text-green-600'>{r.paidStudents}</p>
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <button className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition'>
                          <Eye size={20} />
                        </button>
                        <button onClick={() => downloadReport(r)} title='Download relatório' className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition'>
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Student Form Modal */}
      {showStudentForm && (
        <StudentsForm
          onClose={() => setShowStudentForm(false)}
          onAdd={handleAddStudent}
        />
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentsForm
          onClose={() => setShowPaymentForm(false)}
          onAdd={handleAddPayment}
          students={students}
        />
      )}
    </div>
  )
}

export default SchoolDashboard
