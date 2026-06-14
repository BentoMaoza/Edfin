import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(schools)
  } catch (error) {
    const message = getErrorMessage(error)
    console.error('Admin schools fetch error:', message)
    return NextResponse.json({ error: 'Failed to fetch schools', detail: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json()
    const { id, validated, active } = payload

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const school = await prisma.school.update({
      where: { id: Number(id) },
      data: {
        ...(typeof validated === 'boolean' ? { validated } : {}),
        ...(typeof active === 'boolean' ? { active } : {}),
      },
    })

    return NextResponse.json(school)
  } catch (error) {
    console.error('Admin school update error:', error)
    return NextResponse.json({ error: 'Failed to update school' }, { status: 500 })
  }
}