import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const studentId = typeof payload.studentId === 'string' ? parseInt(payload.studentId, 10) : payload.studentId
    const { amount, type, paymentMethod, month, year } = payload

    // Validation
    if (!studentId || !amount || !type || !paymentMethod || !month || !year) {
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
        month,
        year,
        type,
      },
    })

    if (existingPayment) {
      return NextResponse.json(
        { error: `Payment for ${type} already registered for ${month}/${year}` },
        { status: 409 }
      )
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        studentId: studentIdNumber,
        studentName: student.name,
        amount,
        type,
        paymentMethod,
        month,
        year,
        schoolId: student.schoolId,
        date: new Date(),
      },
    })

    // Update student paidTuitionMonths/paidTransportMonths arrays
    if (student) {
      if (type === 'tuition') {
        const paidMonths = Array.isArray(student.paidTuitionMonths)
          ? student.paidTuitionMonths
          : JSON.parse(student.paidTuitionMonths as string || '[]')
        const monthKey = `${month}/${year}`
        if (!paidMonths.includes(monthKey)) {
          paidMonths.push(monthKey)
          await prisma.student.update({
            where: { id: studentIdNumber },
            data: { paidTuitionMonths: paidMonths },
          })
        }
      } else if (type === 'transport') {
        const paidMonths = Array.isArray(student.paidTransportMonths)
          ? student.paidTransportMonths
          : JSON.parse(student.paidTransportMonths as string || '[]')
        const monthKey = `${month}/${year}`
        if (!paidMonths.includes(monthKey)) {
          paidMonths.push(monthKey)
          await prisma.student.update({
            where: { id: studentIdNumber },
            data: { paidTransportMonths: paidMonths },
          })
        }
      }
    }

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
