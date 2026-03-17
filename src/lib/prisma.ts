import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from "../../prisma/generated/client"

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: Bun.env.DB_USER,
  password: Bun.env.DB_PASS,
  database: Bun.env.DB_NAME,
})

export const db = new PrismaClient({ adapter })
