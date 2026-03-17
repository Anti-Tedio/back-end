import { Context } from "hono"
import { db } from "../../lib/prisma"
import { translateSuggest } from "../../lib/traslateSuggest";

export const historyController = {
    getAll: async (c: Context) => {
        const { lang } = await c.req.json();
        const user = c.get('user')

        const history = await db.history.findMany({
            where: { userId: user.id },
            select: { recommended: true, createdAt: true },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!history.length) {
            return c.json({ message: 'Nenhum histórico encontrado' }, 400)
        }

        await Promise.all(
            history.map(async (h) => {
                h.recommended.plot = await translateSuggest.plot(
                    h.recommended.plot,
                    lang,
                    h.recommended.id
                );
            })
        );

        return c.json(history)
    },

    getTitles: async (userId: string, categoryId?: number) => {
        const history = await db.history.findMany({
            where: {
                userId,
                recommended: { categoryId }
            },
            select: {
                recommended: {
                    select: { title: true }
                }
            }
        })

        const formatted = history.map(h => h.recommended.title)

        return formatted
    },

    create: async (userId: string, recommendedId: string) => {
        const history = await db.history.create({
            data: { userId, recommendedId }
        })
        return history
    }
}