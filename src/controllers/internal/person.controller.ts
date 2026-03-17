import { Context } from "hono"
import { db } from "../../lib/prisma"

export const personController = {
    getAll: async (c: Context) => {
        const persons = await db.person.findMany()

        if (!persons.length) {
            return c.json({ message: 'Nenhum dado cadastrado' }, 404)
        }

        return c.json(persons)
    },

    find: async (c: Context) => {
        const id = Number(c.req.param('id'))

        try {
            const person = await db.person.findUnique({ where: { id } })

            if (!person) {
                return c.json({ message: `Esse id:${id} não existe em Person` }, 400)
            }

            return c.json(person)
        } catch (error) {
            console.error('Erro no banco', error)
            return c.json({ error: 'Erro interno no servidor' }, 500)
        }
    },

    create: async (c: Context) => {
        const { trait } = await c.req.json<{ trait: string }>()

        // try {
        //     const newTrait = await db.person.create({ data: { trait } })
        //     return c.json(newTrait, 201)
        // } catch {
        //     return c.json({ message: 'Essa trait já existe' }, 400)
        // }
    },

    update: async (c: Context) => {
        const { id, trait } = await c.req.json<{ id: number, trait: string }>()
        const normalizedTrait = trait.trim().toLowerCase()

        const person = await db.person.findUnique({ where: { id } })

        if (!person) {
            return c.json({ message: `Esse id:${id} não existe em Person` }, 400)
        }

        if (person.trait === normalizedTrait) {
            return c.json({ message: `Essa trait:${normalizedTrait} é o mesmo da Person` }, 400)
        }

        try {
            const updatedPerson = await db.person.update({
                where: { id },
                data: { trait: normalizedTrait }
            })

            return c.json(updatedPerson, 200)
        } catch (error) {
            console.error('Erro no banco', error)
            return c.json({ error: 'Erro interno no servidor' }, 500)
        }
    }
}