import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'

const ACCESS_SECRET = Bun.env.JWT_ACCESS_SECRET!

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization')

  if (!authHeader) {
    return c.json({ error: 'Token missing' }, 401)
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return c.json({ error: 'Token missing' }, 401)
  }

  try {
    const payload = await verify(token, ACCESS_SECRET,'HS256')

    if (!payload) return c.json({ error: 'User Unauthorized' }, 401)

    c.set('user', {
      id: payload.id as string,
      isAdmin: (payload.isAdmin as boolean) ?? null,
    })

    await next()
  } catch (e) {
    console.error(e)
    return c.json({ error: 'User Unauthorized' }, 401)
  }
})