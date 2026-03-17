import { Context } from "hono"
import { db } from "../../lib/prisma"
import { RecommendedCreateInput, RecommendedCreateManyInput } from "../../../prisma/generated/models"

export const recommendedController = {
    getAll: async (c: Context) => {
        const recommendeds = await db.recommended.findMany()

        if (!recommendeds.length) {
            return c.json({ message: 'Nenhum dado cadastrado' }, 404)
        }

        return c.json(recommendeds)
    },

    findById: async (c: Context) => {
        const id = String(c.req.param('id'))

        try {
            const recommended = await db.recommended.findUnique({ where: { id } })

            if (!recommended) {
                return c.json({ message: `Esse id:${id} não existe em recommended` }, 400)
            }

            return c.json(recommended)
        } catch (error) {
            console.error('Erro no banco', error)
            return c.json({ error: 'Erro interno no servidor' }, 500)
        }
    },
    findByTitle: async (title: string, categoryId: number) => {
        const recommended = await db.recommended.findFirst({ where: { title: { contains: title }, categoryId } })
        return recommended
    },
    create: async (recom: RecommendedCreateInput) => {
        const recommended = await db.recommended.create({
            data: recom
        })
        return recommended
    },

    updateImage: async (c: Context) => {
        const { id, img } = await c.req.json<{ id: string, img: string }>()

        const recommended = await db.recommended.findUnique({ where: { id } })

        if (!recommended) {
            return c.json({ message: `Esse id:${id} não existe em recommended` }, 400)
        }

        if (recommended.img === img) {
            return c.json({ message: `Essa imagem é o mesma que a anterior` }, 400)
        }

        try {
            const updatedRecommended = await db.recommended.update({
                where: { id },
                data: { img }
            })

            return c.json(updatedRecommended, 200)
        } catch (e) {
            console.error('Erro no banco', e)
            return c.json({ error: 'Erro interno no servidor' }, 500)
        }
    }
}