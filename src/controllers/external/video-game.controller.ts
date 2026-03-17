import { isthereanydealService } from "../../services/isthereanydeal.service";
import { RecommendedCreateInput } from "../../../prisma/generated/models";

interface InfoGame {
    title: string,
    appid: number,
    assets: {
        boxart: string
    },
    developers: { name: string }[]
    tags: string[],
    releaseDate: string,
    reviews: { score: number, source: string, url: string }[]
}

export const videoGameController = {
    getVideoGame: async (title: string, description: string) => {

        const gameId = await isthereanydealService.getIdGame<{ id: string }[]>(title);

        const infoGame = await isthereanydealService.getInfoGame<InfoGame>(gameId[0].id);

        const recommendedCreate: RecommendedCreateInput = {
            title: infoGame.title,
            img: infoGame.assets.boxart,
            year: infoGame.releaseDate,
            plot: description,
            creator: infoGame.developers[0].name,
            rating: infoGame.reviews[0].score.toString(),
            category: { connect: { id: 5 } }
        }

        const genres = infoGame.tags

        return { recommendedCreate, genres }
    },
}