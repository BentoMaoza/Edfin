import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId query parameter' }, { status: 400 })
    }

    const reports = await prisma.report.findMany({
      where: { schoolId: parseInt(schoolId, 10) },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Report fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const { schoolId, title, generatedAt, period, totalStudents, paidStudents, payments } = payload

    if (!schoolId || !title || !generatedAt || !period) {
      return NextResponse.json({ error: 'Missing required report fields' }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        schoolId: parseInt(schoolId, 10),
        title,
        generatedAt: new Date(generatedAt),
        period,
        totalStudents: Number(totalStudents) || 0,
        paidStudents: Number(paidStudents) || 0,
        payments: payments ?? [],
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Report creation error:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}