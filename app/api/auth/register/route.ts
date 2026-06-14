import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, schoolName, nuit, contactPerson, phone, address } = body
    if (!email || !password || !schoolName) {
      return NextResponse.json({ error: 'Email, password and school name required' }, { status: 400 })
    }

    const existing = await prisma.school.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'School already registered' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)
    const school = await prisma.school.create({
      data: {
        email,
        password: hashed,
        schoolName,
        nuit: nuit || '',
        address: address || '',
        contactPerson: contactPerson || '',
        phone: phone || '',
      },
    })
    return NextResponse.json({
      id: school.id,
      email: school.email,
      schoolName: school.schoolName,
      nuit: school.nuit,
      validated: school.validated,
      active: school.active,
    })
  } catch (err) {
    const message = getErrorMessage(err)
    console.error('Register error:', message)
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 })
  }
}
