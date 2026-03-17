import { Context } from "hono";
import { geminiService } from "../../services/gemini.service";
import { videoGameController } from "./video-game.controller";
import { bookController } from "./book.controller";
import { userController } from "../internal/user.controller";
import { userPersonControler } from "../internal/userPerson.controller";
import { historyController } from "../internal/history.controller";
import { promptsMidia, PromptMidiaType, promptVideoGame, promptBook } from "../../prompts";
import { categoryController } from "../internal/category.controller";
import { midiaController } from "./midia.controller";
import { recommendedController } from "../internal/recommended.controller";
import { getPriceVideoGame } from "../../lib/getPriceVideoGame";
import { recomGenreControler } from "../internal/recomGenre.controller";
import { Recommended } from "../../../prisma/generated/client";
import { saveSuggestion } from "../../lib/saveSuggestion";
import { translateSuggest } from "../../lib/traslateSuggest";

interface Suggest {
    recommended: Recommended,
    genres: { id: number, name: string }[],
    genresTranslated?: string[]
}

const langs = ['pt', 'en', 'es']

export const aiController = {
    suggestMidia: async (c: Context) => {
        const userPayload = c.get('user');

        const { categoryId, lang } = await c.req.json();

        if (!langs.includes(lang)) {
            return c.json({ error: "Invalid language" }, 400);
        }

        const { id } = userPayload

        const userCredits = await userController.getCredit(id)

        if (userCredits <= 0) return c.json({ message: 'Insufficient credits' }, 403);

        const categorySelected = await categoryController.findById(categoryId)

        if (!promptsMidia[categorySelected as PromptMidiaType] || !categorySelected) return c.json({ message: 'Categoria inválida' }, 404)

        const userTraits = await userPersonControler.getTraits(id)

        if (userTraits.length < 3) return c.json({ message: 'Quantidade de persons insuficíente' }, 400);

        const historyTitles = await historyController.getTitles(id, categoryId)

        const prompt = promptsMidia[categorySelected as PromptMidiaType](userTraits, historyTitles)

        const recommendation = await geminiService.generateRecommendation(prompt, categorySelected);

        let suggest: Suggest

        const recommended = await recommendedController.findByTitle(recommendation.title, categoryId)

        if (!recommended) {
            const res = await midiaController.getMidia(recommendation.title, categoryId)
            suggest = await saveSuggestion(res.recommendedCreate, res.genres)
        }
        else {
            const genres = await recomGenreControler.getAll(recommended.id);
            suggest = { recommended, genres };
        }

        await historyController.create(id, suggest.recommended.id)

        suggest.genresTranslated = await translateSuggest.genres(suggest.genres, lang)
        suggest.recommended.plot = await translateSuggest.plot(suggest.recommended.plot, lang, suggest.recommended.id)

        await userController.removeCredit(id, userCredits)

        return c.json({
            ...suggest.recommended,
            genres: suggest.genresTranslated,
            platforms: recommendation.streaming
        });
    },

    suggestVideoGame: async (c: Context) => {
        const userPayload = c.get('user');

        const { maxPrice, lang } = await c.req.json();

        if (!langs.includes(lang)) {
            return c.json({ error: "Invalid language" }, 400);
        }

        const { id } = userPayload

        if (maxPrice >= 400) return c.json({ error: 'Valor muito alto', message: 'só aceito valores entre 0 - 400' }, 400);

        const userCredits = await userController.getCredit(id)

        if (userCredits <= 0) return c.json({ message: 'Insufficient credits' }, 403);

        const userTraits = await userPersonControler.getTraits(id)

        if (userTraits.length < 3) return c.json({ message: 'Quantidade de persons insuficíente' }, 400);

        const historyTitles = await historyController.getTitles(id, 5)

        const prompt = promptVideoGame.videoGame(userTraits, historyTitles, maxPrice)

        const recommendation = await geminiService.generateRecommendation(prompt, 'game');

        let suggest: Suggest

        const recommended = await recommendedController.findByTitle(recommendation.title, 5)

        if (!recommended) {
            const res = await videoGameController.getVideoGame(recommendation.title, recommendation.description);
            suggest = await saveSuggestion(res.recommendedCreate, res.genres)
        }
        else {
            const genres = await recomGenreControler.getAll(recommended.id);
            suggest = { recommended, genres };
        }

        await historyController.create(id, suggest.recommended.id)

        suggest.genresTranslated = await translateSuggest.genres(suggest.genres, lang)
        suggest.recommended.plot = await translateSuggest.plot(suggest.recommended.plot, lang, suggest.recommended.id)

        const price = await getPriceVideoGame(recommendation.title, recommendation.cheapest_platform)

        await userController.removeCredit(id, userCredits)

        return c.json({ ...suggest.recommended, genres: suggest.genresTranslated, price });
    },

    suggestBook: async (c: Context) => {
        const { lang } = await c.req.json();
        const userPayload = c.get('user');

        if (!langs.includes(lang)) {
            return c.json({ error: "Invalid language" }, 400);
        }

        const { id } = userPayload

        const userCredits = await userController.getCredit(id)

        if (userCredits <= 0) return c.json({ message: 'Insufficient credits' }, 403);

        const userTraits = await userPersonControler.getTraits(id)

        if (userTraits.length < 3) return c.json({ message: 'Quantidade de persons insuficíente' }, 400);

        const historyTitles = await historyController.getTitles(id, 5)

        const prompt = promptBook.book(userTraits, historyTitles)

        const recommendation = await geminiService.generateRecommendation(prompt, 'book');

        let suggest: Suggest

        const recommended = await recommendedController.findByTitle(recommendation.title, 6)

        if (!recommended) {
            const res = await bookController.getBook(recommendation.title, recommendation.author, userPayload.id)
            suggest = await saveSuggestion(res.recommendedCreate, res.genres)
        }
        else {
            const genres = await recomGenreControler.getAll(recommended.id);
            suggest = { recommended, genres };
        }

        await historyController.create(id, suggest.recommended.id)

        suggest.genresTranslated = await translateSuggest.genres(suggest.genres, lang)
        suggest.recommended.plot = await translateSuggest.plot(suggest.recommended.plot, lang, suggest.recommended.id)

        await userController.removeCredit(id, userCredits)

        return c.json({
            ...suggest.recommended,
            genres: suggest.genresTranslated
        });
    },
}