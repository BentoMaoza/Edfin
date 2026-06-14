import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Sparkles, Users } from 'lucide-react'
import SuperHeader from './Components/header/SuperHeader'

const highlights = [
  {
    title: 'Cobrança clara',
    description: 'Acompanhe matrícula, mensalidade e transporte sem perder o controlo dos meses pagos.',
    icon: CheckCircle2,
  },
  {
    title: 'Visão por aluno',
    description: 'Veja rapidamente o que cada estudante já pagou e o que ainda está em aberto.',
    icon: Users,
  },
  {
    title: 'Registo seguro',
    description: 'Dados centralizados para escola, pagamentos e relatórios num único sistema.',
    icon: ShieldCheck,
  },
]

const steps = [
  'Registe a escola e os alunos em poucos minutos.',
  'Registe pagamentos por mês, tipo e método.',
  'Veja devedores, meses pagos e relatórios em tempo real.',
]

const page = () => {
  return (
    <div className='min-h-screen bg-[#0b1220] text-white'>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.1),_transparent_22%),linear-gradient(135deg,_#0b1220_0%,_#10192a_50%,_#111827_100%)]' />
        <div className='absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]' />

        <div className='relative z-10'>
          <SuperHeader />

          <main className='mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-20'>
            <section className='grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
              <div className='space-y-8'>
                <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 shadow-lg backdrop-blur-xl'>
                  <Sparkles size={16} />
                  Gestão escolar com pagamentos, alunos e relatórios num só lugar
                </div>

                <div className='space-y-5'>
                  <h1 className='max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl'>
                    Converta a cobrança da escola num processo claro, rápido e confiável.
                  </h1>
                  <p className='max-w-2xl text-lg leading-8 text-slate-200'>
                    O Edfin ajuda a registar pagamentos, acompanhar meses em falta e manter a escola organizada sem folhas soltas nem contas perdidas.
                  </p>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Link
                    href='/signup'
                    className='inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-2 font-semibold text-blue-600 shadow-lg shadow-black/10 ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300'
                  >
                    Começar agora
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href='/login'
                    className='inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10'
                  >
                    Entrar na conta
                  </Link>
                </div>

                <div className='grid gap-4 sm:grid-cols-3'>
                  <div className='rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl'>
                    <p className='text-sm text-slate-300'>Pagamentos</p>
                    <p className='mt-1 text-2xl font-bold'>Mensalidade, transporte e matrícula</p>
                  </div>
                  <div className='rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl'>
                    <p className='text-sm text-slate-300'>Meses em falta</p>
                    <p className='mt-1 text-2xl font-bold'>Veja o que falta por aluno</p>
                  </div>
                  <div className='rounded-3xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl'>
                    <p className='text-sm text-slate-300'>Relatórios</p>
                    <p className='mt-1 text-2xl font-bold'>Acompanhe tudo em tempo real</p>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute -inset-4 rounded-[2rem] bg-cyan-400/10 blur-3xl' />
                <div className='relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl'>
                  <div className='mb-6 flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-slate-300'>Painel de controlo</p>
                      <h2 className='text-2xl font-bold'>Visão rápida da escola</h2>
                    </div>
                    <div className='rounded-2xl bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-300'>
                      Atualizado
                    </div>
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='rounded-2xl border border-white/10 bg-slate-950/35 p-4'>
                      <p className='text-sm text-slate-300'>Alunos</p>
                      <p className='mt-2 text-3xl font-black'>Todos organizados</p>
                      <p className='mt-2 text-sm text-slate-400'>Perfil, encargados, classe e estado financeiro em um só ponto.</p>
                    </div>
                    <div className='rounded-2xl border border-white/10 bg-slate-950/35 p-4'>
                      <p className='text-sm text-slate-300'>Pagamentos</p>
                      <p className='mt-2 text-3xl font-black'>Mês a mês</p>
                      <p className='mt-2 text-sm text-slate-400'>Identifique quem pagou e quem ainda deve de forma visual.</p>
                    </div>
                    <div className='rounded-2xl border border-white/10 bg-slate-950/35 p-4 sm:col-span-2'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-2xl bg-cyan-400/15 p-3 text-cyan-300'>
                          <CreditCard size={22} />
                        </div>
                        <div>
                          <p className='text-sm text-slate-300'>Experiência prática</p>
                          <p className='font-semibold'>Registe pagamentos, apague lançamentos e acompanhe o histórico sem complicação.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className='grid gap-6 lg:grid-cols-3'>
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className='rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl'>
                    <div className='mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-cyan-300'>
                      <Icon size={22} />
                    </div>
                    <h3 className='text-xl font-bold'>{item.title}</h3>
                    <p className='mt-3 text-sm leading-7 text-slate-300'>{item.description}</p>
                  </div>
                )
              })}
            </section>

            <section className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
              <div className='rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl'>
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300'>Como funciona</p>
                <h2 className='mt-3 text-3xl font-bold'>Uma rotina simples para a escola inteira</h2>
                <div className='mt-6 space-y-4'>
                  {steps.map((step, index) => (
                    <div key={step} className='flex gap-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 font-bold text-cyan-300'>
                        {index + 1}
                      </div>
                      <p className='text-sm leading-7 text-slate-200'>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='grid gap-6'>
                <div className='rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-cyan-400/20 to-white/5 p-6 shadow-xl backdrop-blur-xl'>
                  <p className='text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200'>Para visitantes</p>
                  <h2 className='mt-3 text-3xl font-bold'>Dê menos trabalho à equipa e mais confiança aos pais.</h2>
                  <p className='mt-4 text-sm leading-7 text-slate-200'>
                    O sistema reduz dúvidas sobre pagamentos, ajuda a responder rápido às famílias e mantém os registos sempre acessíveis.
                  </p>
                </div>

                <div className='rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl'>
                  <p className='text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300'>Próximo passo</p>
                  <h3 className='mt-3 text-2xl font-bold'>Entre e comece a gerir hoje mesmo.</h3>
                  <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
                    <Link
                      href='/signup'
                      className='inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100'
                    >
                      Criar conta
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href='/login'
                      className='inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10'
                    >
                      Aceder ao painel
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default page