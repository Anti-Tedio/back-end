import { RecommendedCreateInput } from "../../prisma/generated/models";
import { genreController } from "../controllers/internal/genre.controller";
import { recomGenreControler } from "../controllers/internal/recomGenre.controller";
import { recommendedController } from "../controllers/internal/recommended.controller";

export async function saveSuggestion(recommendedCreate:RecommendedCreateInput, genresName:string[]) {

    const recommended = await recommendedController.create(recommendedCreate);

    const genres = genresName.map(g=>({name:g}))

    await genreController.createMany(genres)

    const genresId = await genreController.findName(genresName)

    await recomGenreControler.create(genresId, recommended.id)

    return {recommended, genres:genresId}
}