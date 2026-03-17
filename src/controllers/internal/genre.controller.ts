import { Context } from "hono"
import { db } from "../../lib/prisma"

export const genreController = {
    getAll: async (c: Context) => {
        const genres = await db.genre.findMany()

        if (!genres.length) {
            return c.json({ message: 'Nenhum dado cadastrado' }, 404)
        }

        return c.json(genres)
    },

    find: async (c: Context) => {
        const id = Number(c.req.param('id'))

        try {
            const genre = await db.genre.findUnique({ where: { id } })

            if (!genre) {
                return c.json({ message: `Esse id:${id} não existe em genre` }, 400)
            }

            return c.json(genre)
        } catch (error) {
            console.error('Erro no banco', error)
            return c.json({ error: 'Erro interno no servidor' }, 500)
        }
    },

    findName: async (name: string[]) => {
        try {
            const genresId = await db.genre.findMany({
                where: {
                    name: {
                        in: name
                    }
                },
                select: {
                    id: true,
                    name:true
                }
            });
            return genresId
        } catch (error) {
            console.error('Erro no banco', error)
            throw error
        }
    },

    createMany: async (genres: { name: string }[]) => {
        await db.genre.createMany({ data: genres, skipDuplicates: true })
    },

    update: async (c: Context) => {
        const { id, name } = await c.req.json<{ id: number, name: string }>()
        const normalizedName = name.trim().toLowerCase()

        const genre = await db.genre.findUnique({ where: { id } })

        if (!genre) {
            return c.json({ message: `Esse id:${id} não existe em genre` }, 400)
        }

        if (genre.name === normalizedName) {
            return c.json({ message: `Esse name:${normalizedName} é o mesmo da genre` }, 400)
        }

        try {
            const updatedGenre = await db.genre.update({
                where: { id },
                data: { name: normalizedName }
            })

            return c.json(updatedGenre, 200)
        } catch (error) {
            console.error('Erro no banco', error)
            return c.json({ error: 'Erro interno no servidor' }, 500)
        }
    }
}