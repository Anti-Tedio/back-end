import { Context } from "hono"
import { db } from "../../lib/prisma"

export const categoryController = {
    getAll: async (c: Context) => {
        const categorys = await db.category.findMany()

        if (!categorys.length) {
            return c.json({ message: 'Nenhum dado cadastrado' }, 400)
        }

        return c.json(categorys)
    },

    findById: async (id: number) => {
        const category = await db.category.findUnique({ where: { id } })
        // if (!category) {
        //     return new Error(`Esse id:${id} não existe em category`)
        // }

        const categoryFormatted = category?.title['en'] || 'Sem tredução'
        return categoryFormatted.toLowerCase();
    },

    // create: async (c: Context) => {
    //     const { title } = await c.req.json<{ title: string }>()
    //     const normalizedTitle = title.trim().toLowerCase()

    //     try {
    //         const newCategory = await db.category.create({
    //             data: { title: normalizedTitle }
    //         })
    //         return c.json(newCategory, 201)
    //     } catch {
    //         return c.json({ message: 'Esse title já existe' }, 400)
    //     }
    // },

    // update: async (c: Context) => {
    //     const { id, title } = await c.req.json<{ id: number, title: string }>()
    //     const normalizedTitle = title.trim().toLowerCase()

    //     const category = await db.category.findUnique({ where: { id } })

    //     if (!category) {
    //         return c.json({ message: `Esse id:${id} não existe em category` }, 400)
    //     }

    //     if (category.title === normalizedTitle) {
    //         return c.json({ message: `Esse title:${normalizedTitle} é o mesmo da category` }, 400)
    //     }

    //     try {
    //         const updatedCategory = await db.category.update({
    //             where: { id },
    //             data: { title: normalizedTitle }
    //         })

    //         return c.json(updatedCategory, 200)
    //     } catch (error) {
    //         console.error('Erro no banco', error)
    //         return c.json({ error: 'Erro interno no servidor' }, 500)
    //     }
    // }
}