import { OmdbResponse } from "../../types";
import { omdbService } from "../../services/omdb.service";
import { RecommendedCreateInput } from "../../../prisma/generated/models";

export const midiaController = {
    getMidia: async (title: string, categoryId: number) => {

        const getMidia = {
            movie: async () => await omdbService.getMovie<OmdbResponse>(title),
            serie: async () => await omdbService.getSerie<OmdbResponse>(title)
        }

        const key: keyof typeof getMidia = categoryId === 1 ? 'movie' : 'serie'

        const data = await getMidia[key]()

        const recommendedCreate: RecommendedCreateInput = {
            title: data.Title,
            img: data.Poster,
            year: data.Year.replace(/–\s*$/, ""),
            plot: data.Plot,
            creator: data.Writer,
            rating: data.imdbRating,
            category: {
                connect: { id: categoryId }
            }

        }

        const genres = data.Genre.split(/\s*,\s*/)

        return {recommendedCreate, genres}
    },
}