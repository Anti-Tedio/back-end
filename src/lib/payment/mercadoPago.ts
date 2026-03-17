import MercadoPagoConfig, { Preference } from "mercadopago"
import { Product } from "../../../prisma/generated/client"

const client = new MercadoPagoConfig({ accessToken: Bun.env.MP_ACCESS_TOKEN! })

export async function createPreferenceMP(userId: string, product: Product) {
    const preference = await new Preference(client).create({
        body: {
            items: [
                {
                    id: product.id,
                    title: 'Pacote de Créditos Anti-tédio',
                    quantity: 1,
                    unit_price: product.price,
                    currency_id: 'BRL'
                }
            ],
            external_reference: userId,
            notification_url: `${Bun.env.BACKEND_URL}/webhooks/mp`,
            back_urls: {
                "success": `${Bun.env.FRONTEND_URL}/success`,
                "failure": `${Bun.env.FRONTEND_URL}/failure`,
                "pending": `${Bun.env.FRONTEND_URL}/pending`
            },
            auto_return: 'approved'
        }
    })
    return preference.init_point
}