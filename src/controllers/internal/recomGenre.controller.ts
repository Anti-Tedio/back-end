import { db } from "../../lib/prisma"

export const recomGenreControler = {
    getAll: async (recommendedId:string) => {
        const res = await db.recom_Genre.findMany({ 
            where: { recommendedId },
            select:{genre:{select:{name:true, id:true}}} 
        })

        const genres = res.map(g=>({name:g.genre.name, id:g.genre.id}));
        
        return genres
    },

    create: async (genresId: { id: number }[], recommendedId: string) => {
        const genresCreate = genresId.map(g => ({ genreId: g.id, recommendedId }))

        try {
            await db.recom_Genre.createMany({
                data: genresCreate,
                skipDuplicates: true,
            })
        } catch (e) {
            return { error: "Erro ao criar a recom_Genre" }
        }
    }
}