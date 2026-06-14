import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'change_me'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })

    const school = await prisma.school.findUnique({ where: { email } })
    if (!school) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await bcrypt.compare(password, school.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    if (!school.validated) {
      return NextResponse.json({ error: 'School is awaiting validation' }, { status: 403 })
    }

    if (!school.active) {
      return NextResponse.json({ error: 'School account is inactive' }, { status: 403 })
    }

    const token = jwt.sign({ schoolId: school.id }, JWT_SECRET, { expiresIn: '7d' })

    const res = NextResponse.json({
      ok: true,
      school: {
        id: school.id,
        email: school.email,
        schoolName: school.schoolName,
        nuit: school.nuit,
        validated: school.validated,
        active: school.active,
      },
    })
    res.headers.set('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    }))

    return res
  } catch (err) {
    const message = getErrorMessage(err)
    console.error('Login error:', message)
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 })
  }
}
