import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const normalizeMonths = (value: unknown): number[] => {
  if (Array.isArray(value)) return value.map((item) => Number(item)).filter((item) => !Number.isNaN(item))
  try {
    const parsed = JSON.parse(String(value))
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item: unknown) => Number(item))
      .filter((item) => !Number.isNaN(item))
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const studentId = typeof payload.studentId === 'string' ? parseInt(payload.studentId, 10) : payload.studentId
    const { amount, type, paymentMethod, month, year } = payload
    const amountNumber = Number(amount)
    const monthNumber = Number(month)
    const yearNumber = Number(year)

    // Validation
    if (
      !studentId ||
      Number.isNaN(amountNumber) ||
      !type ||
      !paymentMethod ||
      Number.isNaN(monthNumber) ||
      Number.isNaN(yearNumber)
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      const studentPayload = payload.student
      const schoolIdRaw = payload.schoolId
      const schoolEmail = payload.schoolEmail
      const schoolName = payload.schoolName
      const nuit = payload.nuit
      const schoolId = typeof schoolIdRaw === 'string' ? parseInt(schoolIdRaw, 10) : schoolIdRaw

      if (!studentPayload || (!schoolId && !schoolEmail)) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        )
      }

      let school = null
      if (schoolId && !Number.isNaN(schoolId)) {
        school = await prisma.school.findUnique({ where: { id: schoolId } })
      }

      if (!school && schoolEmail) {
        school = await prisma.school.upsert({
          where: { email: schoolEmail },
          create: {
            email: schoolEmail,
            password: '',
            schoolName: schoolName || 'Escola Desconhecida',
            nuit: nuit || '',
            contactPerson: studentPayload.guardianName || 'Administrador',
            phone: studentPayload.phone || '',
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

      student = await prisma.student.create({
        data: {
          schoolId: school.id,
          name: studentPayload.name,
          class: studentPayload.class,
          guardianName: studentPayload.guardianName,
          phone: studentPayload.phone || '',
          tuition: Number(studentPayload.tuition) || 0,
          transport: Number(studentPayload.transport) || 0,
          usesTransport: !!studentPayload.usesTransport,
          registrationFee: !!studentPayload.registrationFee,
          paidTuitionMonths: Array.isArray(studentPayload.paidTuitionMonths)
            ? studentPayload.paidTuitionMonths
            : [],
          paidTransportMonths: Array.isArray(studentPayload.paidTransportMonths)
            ? studentPayload.paidTransportMonths
            : [],
        },
      })

      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        )
      }
    }

    const studentIdNumber = student.id

    // Check if payment already exists for this student/month/year/type
    const existingPayment = await prisma.payment.findFirst({
      where: {
        studentId: studentIdNumber,
        month: monthNumber,
        year: yearNumber,
        type,
      },
    })

    if (existingPayment) {
      return NextResponse.json(
        { error: `Payment for ${type} already registered for ${month}/${year}` },
        { status: 409 }
      )
    }

    // Update student payment state for months or registration fee
    const updateData: any = {}

    if (type === 'tuition') {
      const paidMonths = normalizeMonths(student.paidTuitionMonths)
      if (!paidMonths.includes(monthNumber)) {
        paidMonths.push(monthNumber)
        updateData.paidTuitionMonths = paidMonths
      }
    } else if (type === 'transport') {
      const paidMonths = normalizeMonths(student.paidTransportMonths)
      if (!paidMonths.includes(monthNumber)) {
        paidMonths.push(monthNumber)
        updateData.paidTransportMonths = paidMonths
      }
    } else if (type === 'registration') {
      updateData.registrationFee = true
    }

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          studentId: studentIdNumber,
          studentName: student.name,
          amount: amountNumber,
          type,
          paymentMethod,
          month: monthNumber,
          year: yearNumber,
          schoolId: student.schoolId,
          date: new Date(),
        },
      }),
      ...(Object.keys(updateData).length > 0
        ? [prisma.student.update({ where: { id: studentIdNumber }, data: updateData })]
        : []),
    ])

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const schoolId = searchParams.get('schoolId')

    const where: any = {}
    if (studentId) where.studentId = parseInt(studentId)
    if (schoolId) where.schoolId = parseInt(schoolId)

    const payments = await prisma.payment.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const paymentId = parseInt(idParam, 10)
    if (Number.isNaN(paymentId)) {
      return NextResponse.json({ error: 'Invalid payment id' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const student = await prisma.student.findUnique({ where: { id: payment.studentId } })
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (payment.type === 'tuition') {
      updateData.paidTuitionMonths = normalizeMonths(student.paidTuitionMonths).filter((month) => month !== payment.month)
    } else if (payment.type === 'transport') {
      updateData.paidTransportMonths = normalizeMonths(student.paidTransportMonths).filter((month) => month !== payment.month)
    } else if (payment.type === 'registration') {
      updateData.registrationFee = false
    }

    await prisma.$transaction([
      prisma.payment.delete({ where: { id: paymentId } }),
      prisma.student.update({ where: { id: student.id }, data: updateData }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Payment delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}
