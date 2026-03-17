import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { aiController } from "../controllers/external/ai.controller"
import { authMiddleware } from '../lib/auth-plugin'

const aiRoutes = new Hono()
aiRoutes.use('*', authMiddleware)

aiRoutes.post('/book', aiController.suggestBook)

aiRoutes.post(
  '/video-game',
  zValidator('json', z.object({
    maxPrice: z.number().min(1)
  })),
  aiController.suggestVideoGame
)

aiRoutes.post('/midia', zValidator('json', z.object({
  categoryId: z.number().min(1)
})), aiController.suggestMidia)

export { aiRoutes }