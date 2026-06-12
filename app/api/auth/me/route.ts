import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change_me'

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const token = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('token='))?.split('=')[1]
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const school = await prisma.school.findUnique({ where: { id: Number((payload as any).schoolId) } })
    if (!school) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ id: school.id, email: school.email, schoolName: school.schoolName })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
