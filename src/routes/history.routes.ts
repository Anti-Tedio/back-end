import { Hono } from 'hono'
import { historyController } from "../controllers/internal/history.controller"
import { authMiddleware } from "../lib/auth-plugin"
import { zValidator } from '@hono/zod-validator'
import z from 'zod'

const historyRoutes = new Hono()

historyRoutes.post('/', zValidator('json', z.object({ lang: z.string().min(2) })), authMiddleware, historyController.getAll)

export { historyRoutes }