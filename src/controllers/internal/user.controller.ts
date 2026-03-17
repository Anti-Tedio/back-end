import { Context } from 'hono'
import { db } from '../../lib/prisma'
import { saveAvatar, deleteAvatar } from '../../lib/upload'

function formaterURL(path: string) {
  if (path.startsWith('https') || path.startsWith('http')) return path;
  return `${Bun.env.BACKEND_URL}${path}`
}

export const userController = {
  getAll: async (c: Context) => {
    const user = c.get('user')

    if (!user.isAdmin) {
      return c.json({ message: 'User Unauthorized' }, 401)
    }

    const users = await db.user.findMany()
    return c.json(users)
  },

  getUser: async (c: Context) => {
    const user = c.get('user')

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true, credits: true, avatarUrl: true },
    })

    if (!userData) return c.json({ ok: false, mensage: 'Usuário não encontrado' }, 404);

    if (userData.avatarUrl)
      userData.avatarUrl = formaterURL(userData.avatarUrl)

    return c.json(userData)
  },

  updateAvatar: async (c: Context) => {
    const user = c.get('user')

    const body = await c.req.parseBody()
    const file = body['avatar']

    if (!file || typeof file === 'string') {
      return c.json({ message: 'Nenhuma imagem enviada.' }, 400)
    }

    const current = await db.user.findFirst({
      where: { id: user.id },
      select: { avatarUrl: true },
    })

    const avatarUrl = await saveAvatar(file)

    await db.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    })

    if (current?.avatarUrl) {
      await deleteAvatar(current.avatarUrl)
    }

    return c.json({ avatarUrl: formaterURL(avatarUrl) })
  },

  getCredit: async (id: string) => {
    const userCredit = await db.user.findFirst({
      where: { id, credits: { gt: 0 } },
      select: { credits: true },
    })

    return userCredit?.credits ?? 0
  },

  removeCredit: async (id: string, credits: number) => {
    await db.user.update({ where: { id }, data: { credits: credits - 1 } })
  },

  addCredit: async (userId: string, credits: number) => {
    await db.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } }
    })
  }
}