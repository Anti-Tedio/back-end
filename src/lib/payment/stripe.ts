import Stripe from "stripe";
import { Product } from "../../../prisma/generated/client";

const stripe = new Stripe(Bun.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
})

export async function createStripeSession(userId: string, product: Product) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Anti-tédio Credits Pack',
                        metadata: {
                            productId: product.id
                        }
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        client_reference_id: userId,
        metadata: {
            userId: userId,
            productId: product.id
        },
        success_url: `${Bun.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${Bun.env.FRONTEND_URL}/failure`,
    })

    return session.url
}