import { Hono } from 'hono'
import { webhookController } from '../controllers/external/webhook.controller'

const webhookRoutes = new Hono()

webhookRoutes.post('/mp', webhookController.mp)
webhookRoutes.post('/stripe', webhookController.stripe)

export { webhookRoutes }