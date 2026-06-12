import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, schoolName, nuit, contactPerson, phone } = body
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
        contactPerson: contactPerson || '',
        phone: phone || '',
      },
    })
    return NextResponse.json({ id: school.id, email: school.email, schoolName: school.schoolName })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
