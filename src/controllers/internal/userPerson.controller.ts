import { Context } from "hono"
import { db } from "../../lib/prisma"

interface Person {
    id: number,
    isActive: boolean
}

export const userPersonControler = {
    getAll: async (c: Context) => {
        const user = c.get('user')

        const persons = await db.user_Person.findMany({
            where: { userId: user.id, isActive: true },
            select: { person: true, isActive: true }
        })

        if (!persons.length) {
            return c.json({ message: 'Nenhuma userPerson encontrada' }, 400)
        }

        const formatted = persons.map(({ isActive, person }) => ({
            ...person,
            isActive: isActive
        }))

        return c.json(formatted)
    },

    getTraits: async (userId: string) => {

        const userPerson = await db.user_Person.findMany({
            where: { userId, isActive: true },
            select: { person: { select: { trait: true } } }
        })

        const formatted = userPerson.map(p => {
            const trait = p.person.trait as PrismaJson.PersonTraits;
            return trait?.['en'] || trait?.['pt'] || "Sem tradução";
        });

        return formatted
    },

    create: async (c: Context) => {
        const user = c.get('user')
        const { persons } = await c.req.json<{ persons: Person[] }>()

        if (persons.length > 8) {
            return c.json({ message: "Muitas persons" }, 400)
        }

        try {
            await db.user_Person.updateMany({
                where: { userId: user.id, isActive: true },
                data: { isActive: false }
            })

            await db.$transaction(
                persons.map((person: Person) =>
                    db.user_Person.upsert({
                        where: {
                            userId_personId: {
                                userId: user.id,
                                personId: person.id,
                            },
                        },
                        update: { isActive: true },
                        create: {
                            userId: user.id,
                            personId: person.id,
                            isActive: true,
                        },
                    })
                )
            )

            return c.json({ ok: true }, 201)
        } catch (e) {
            return c.json({ error: "Erro ao atualizar person" }, 500)
        }
    }
}