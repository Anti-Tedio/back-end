import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'
import { categoryController } from "../controllers/internal/category.controller"

const categoryRoutes = new Hono()

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

const categorySchema = z.object({
  title: z.string().min(4)
})

const updateSchema = z.object({
  id: z.number(),
  title: z.string().min(4)
})

categoryRoutes.get('/', categoryController.getAll)

// categoryRoutes.get('/:id', 
//   zValidator('param', z.object({ id: z.coerce.number() })), 
//   (c) => categoryController.find(c)
// )

categoryRoutes.post('/', 
  adminMiddleware, 
  zValidator('json', categorySchema), 
  categoryController.create
)

categoryRoutes.put('/', 
  adminMiddleware, 
  zValidator('json', updateSchema), 
  categoryController.update
)

export { categoryRoutes }