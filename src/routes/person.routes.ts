import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'
import { personController } from "../controllers/internal/person.controller"

const personRoutes = new Hono()

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'chave secreta'

const adminMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) return c.json({ error: 'Token missing' }, 401)

  try {
    const payload = await verify(token, ACCESS_SECRET, 'HS256')
    
    if (!payload.isAdmin) {
      return c.json({ error: 'User Unauthorized' }, 401)
    }

    await next()
  } catch (e) {
    return c.json({ error: 'User Unauthorized' }, 401)
  }
})

const createSchema = z.object({
  trait: z.string().min(3)
})

const updateSchema = z.object({
  id: z.number(),
  trait: z.string().min(3)
})

personRoutes.get('/', personController.getAll)

personRoutes.get('/:id', 
  zValidator('param', z.object({ id: z.coerce.number() })), 
  personController.find
)

personRoutes.post('/', 
  adminMiddleware, 
  zValidator('json', createSchema), 
  personController.create
)

personRoutes.put('/', 
  adminMiddleware, 
  zValidator('json', updateSchema), 
  personController.update
)

export { personRoutes }