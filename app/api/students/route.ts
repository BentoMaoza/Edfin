import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json(
        { error: 'Missing schoolId query parameter' },
        { status: 400 }
      )
    }

    const students = await prisma.student.findMany({
      where: { schoolId: parseInt(schoolId, 10) },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Student fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const {
      name,
      class: className,
      guardianName,
      phone,
      tuition,
      transport,
      usesTransport,
      registrationFee,
      paidTuitionMonths,
      paidTransportMonths,
      schoolId: schoolIdRaw,
      schoolEmail,
      schoolName: schoolNameFromClient,
      nuit,
    } = payload

    const schoolId = typeof schoolIdRaw === 'string' ? parseInt(schoolIdRaw, 10) : schoolIdRaw
    if ((!schoolId && !schoolEmail) || !name || !className || !guardianName || !phone) {
      return NextResponse.json(
        { error: 'Missing required student fields' },
        { status: 400 }
      )
    }

    let school = await prisma.school.findUnique({ where: { id: schoolId } })
    if (!school && schoolEmail) {
      school = await prisma.school.upsert({
        where: { email: schoolEmail },
        create: {
          email: schoolEmail,
          password: '',
          schoolName: schoolNameFromClient || 'Unknown School',
          nuit: nuit || '',
          contactPerson: guardianName || '',
          phone: phone || '',
        },
        update: {},
      })
    }

    if (!school) {
      return NextResponse.json(
        { error: 'Invalid school reference' },
        { status: 400 }
      )
    }

    const student = await prisma.student.create({
      data: {
        schoolId: school.id,
        name,
        class: className,
        guardianName,
        phone,
        tuition: Number(tuition) || 0,
        transport: Number(transport) || 0,
        usesTransport: !!usesTransport,
        registrationFee: !!registrationFee,
        paidTuitionMonths: Array.isArray(paidTuitionMonths) ? paidTuitionMonths : [],
        paidTransportMonths: Array.isArray(paidTransportMonths) ? paidTransportMonths : [],
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Student creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
