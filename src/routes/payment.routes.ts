import { Hono } from 'hono'
import { paymentController } from '../controllers/external/payment.controller'
import { authMiddleware } from '../lib/auth-plugin'

const paymentRoutes = new Hono()

paymentRoutes.post('/checkout', authMiddleware, paymentController.checkout)

export { paymentRoutes }