import { PrismaClient } from '@prisma/client'

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error('DATABASE_URL is not defined. Configure it in your environment.')
  }

  if (url.startsWith('postgresql://') || url.startsWith('mysql://')) {
    return url
  }

  if (!url.startsWith('file:')) {
    throw new Error('DATABASE_URL must start with file: for SQLite or a valid SQL URL for Postgres/MySQL.')
  }

  return url
}

const prismaOptions = {
  log: ['query'] as Array<'query'>,
  errorFormat: 'pretty' as const,
}

declare global {
  // allow global in dev to avoid multiple instances during hot reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const url = getDatabaseUrl()

export const prisma = global.prisma ?? new PrismaClient({
  ...prismaOptions,
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
