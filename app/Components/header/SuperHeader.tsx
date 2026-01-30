'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const SuperHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

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
    <header className='w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 md:h-20'>
          
          {/* Logo */}
          <Link href='/' className='flex-shrink-0'>
            <span className='text-2xl md:text-3xl font-bold text-white hover:text-blue-100 transition-colors duration-300'>
              Edfin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8 ml-auto'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-white font-medium hover:text-blue-100 transition-colors duration-300 text-sm lg:text-base'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <button className='hidden md:block ml-6 px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300'>
            Começar
          </button>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className='md:hidden text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-2'
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className='md:hidden pb-4 border-t border-blue-500'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='block px-3 py-2 rounded-md text-white hover:bg-blue-700 transition-colors duration-300 font-medium'
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button className='w-full mt-4 px-3 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300'>
              Começar
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default SuperHeader