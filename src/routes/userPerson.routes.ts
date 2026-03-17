import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { userPersonControler } from "../controllers/internal/userPerson.controller"
import { authMiddleware } from "../lib/auth-plugin"

const userPersonRoutes = new Hono()

const createSchema = z.object({
  persons: z.array(
    z.object({
      id: z.number().min(1)
    })
  )
})

userPersonRoutes.use('*', authMiddleware)

userPersonRoutes.get('/',userPersonControler.getAll)

userPersonRoutes.post(
  '/',
  zValidator('json', createSchema),
  userPersonControler.create
)

export { userPersonRoutes }