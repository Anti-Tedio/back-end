import { Context } from "hono"
import { db } from "../../lib/prisma"

export const productController = {
    getAll: async (c: Context) => {
        let country = c.req.header('cf-ipcountry')
        if(country!='BR'){
            country="GLOBAL"
        }
        const products = await db.product.findMany({ where: { region: country } })

        if (!products.length) {
            return c.json({ message: 'Nenhum dado cadastrado' }, 404)
        }

        return c.json(products)
    },

    findById: async (id: string) => {
        try {
            const product = await db.product.findUnique({ where: { id } })
            return product
        } catch (error) {
            console.error('Erro no banco', error)
            throw 'Erro interno no servidor'
        }
    },
}