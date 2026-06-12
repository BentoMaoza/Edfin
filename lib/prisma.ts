import { PrismaClient } from '@prisma/client'

declare global {
  // allow global in dev to avoid multiple instances during hot reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma ?? new PrismaClient({ 
  log: ['query'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
