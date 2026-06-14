'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const SuperHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <header className='sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-blue-700/95 via-blue-700/90 to-blue-900/95 shadow-[0_12px_40px_rgba(15,23,42,0.25)] backdrop-blur-xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between md:h-20'>
          <Link href='/' className='flex-shrink-0'>
            <span className='inline-flex items-center gap-3 text-2xl font-black tracking-tight text-white transition-transform duration-300 hover:scale-[1.02] md:text-3xl'>
              
              Edfin
            </span>
          </Link>

          <nav className='ml-auto hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 md:flex'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 lg:text-base ${
                  pathname === link.href
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link href='/signup' className='ml-2 inline-flex items-center rounded-full bg-white px-5 py-2 font-semibold text-blue-700 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50'>
              Começar
            </Link>
          </nav>

          <button
            onClick={toggleMenu}
            className='rounded-xl p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 md:hidden'
            aria-label='Abrir menu'
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {isOpen && (
          <nav className='md:hidden pb-4 pt-2'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-2xl px-4 py-3 font-medium transition-colors duration-300 ${
                  pathname === link.href ? 'bg-white text-blue-700' : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href='/signup' onClick={() => setIsOpen(false)} className='mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 font-semibold text-blue-700 shadow-lg shadow-black/10 transition hover:bg-blue-50'>
              Começar
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default SuperHeader