import { Context } from "hono";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { productController } from "../internal/product.controller";
import { paymentController } from "./payment.controller";
import { SavePayment } from "../../types";
import { userController } from "../internal/user.controller";
import Stripe from "stripe";

const client = new MercadoPagoConfig({ accessToken: Bun.env.MP_ACCESS_TOKEN! });
const stripe = new Stripe(Bun.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
})

export const webhookController = {
    mp: async (c: Context) => {
        const body = await c.req.json()

        if (body.type !== 'payment') return c.json({ received: true })

        const paymentId = body.data.id

        const mbPayment = await new Payment(client).get({ id: paymentId })

        if (mbPayment.status !== 'approved') return c.json({ received: true })

        const productId = mbPayment.additional_info?.items?.[0]?.id

        if (!productId) return c.json({ received: true })

        if (!mbPayment.external_reference) return c.json({ received: true })

        const product = await productController.findById(productId)

        if (!product) return c.json({ received: true })

        const paymentSave: SavePayment = {
            userId: mbPayment.external_reference,
            externalId: String(paymentId),
            productId: product.id,
            status: 'approved'
        }

        await paymentController.save(paymentSave)

        await userController.addCredit(paymentSave.userId, product.credits);

        return c.json({ received: true })
    },
    stripe: async (c: Context) => {
        const signature = c.req.header('stripe-signature')
        const webhookSecret = Bun.env.STRIPE_WEBHOOK_SECRET!

        let event: Stripe.Event

        try {
            const body = await c.req.arrayBuffer()
            event = await stripe.webhooks.constructEventAsync(
                Buffer.from(body),
                signature!,
                webhookSecret
            )
        } catch (e) {
            return c.json({ error: 'Webhook signature verification failed' }, 400)
        }

        if (event.type !== 'checkout.session.completed') {
            return c.json({ received: true })
        }

        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') {
            return c.json({ received: true })
        }

        const userId = session.metadata?.userId
        const productId = session.metadata?.productId

        if (!userId || !productId) {
            return c.json({ received: true })
        }

        const product = await productController.findById(productId)

        if (!product) {
            return c.json({ received: true })
        }

        const paymentSave: SavePayment = {
            userId: userId,
            externalId: session.id,
            productId: product.id,
            status: 'approved'
        }

        await paymentController.save(paymentSave)
        await userController.addCredit(userId, product.credits)

        return c.json({ received: true })
    }
}