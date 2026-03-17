import { Hono } from 'hono'
import { userController } from "../controllers/internal/user.controller"
import { authMiddleware } from "../lib/auth-plugin"
import { serveStatic } from 'hono/bun'

const userRoutes = new Hono()

userRoutes.use('/avatars/*', serveStatic({ root: './public' }))
userRoutes.use('*', authMiddleware)

userRoutes.get('/', userController.getUser)
userRoutes.get('/all', userController.getAll)
userRoutes.patch('/avatar', userController.updateAvatar)

export { userRoutes }