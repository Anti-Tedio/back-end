import { Context } from "hono"
import { db } from "../../lib/prisma"
import { productController } from "../internal/product.controller"
import { SavePayment } from "../../types"
import { createPreferenceMP } from "../../lib/payment/mercadoPago"
import { createStripeSession } from "../../lib/payment/stripe"


export const paymentController = {
    checkout: async (c: Context) => {
        const country = c.req.header('cf-ipcountry') || 'GLOBAL'
        const user = c.get('user')
        const { productId } = await c.req.json()

        const product = await productController.findById(productId)

        if (!product) return c.json('Product not found', 404)


        // const preference = await createPreferenceMP(user.id, product)

        const url = country=='GLOBAL' ? await createStripeSession(user.id,product): await createPreferenceMP(user.id, product)


        return c.json({ url })
    },
    save: async (savePayment: SavePayment) => {
        await db.payment.create({
            data: savePayment
        })
    }
}