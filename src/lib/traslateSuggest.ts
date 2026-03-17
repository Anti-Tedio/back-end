import { GenreTranslationCreateManyInput } from "../../prisma/generated/models";
import { translateText } from "../services/googleCloudTraslation.service";
import { db } from "./prisma";


export const translateSuggest = {
    genres: async (genres: { id: number, name: string }[], language: string) => {
        if (language === 'en' || genres.length === 0) return genres.map(g => g.name);

        const existingTranslations = await db.genreTranslation.findMany({
            where: {
                language,
                genreId: { in: genres.map(g => g.id) }
            }
        });

        const translationMap = new Map(existingTranslations.map(t => [t.genreId, t.content]));

        const genresToTranslate = genres.filter(g => !translationMap.has(g.id));

        if (genresToTranslate.length === 0) return existingTranslations.map(e => e.content);

        try {
            const namesToTranslate = genres.map(g => g.name).join(' | ');
            const translated = await translateText(namesToTranslate, language);

            if (!translated) return genres.map(g => g.name);

            const translatedNames = translated.split(/\s*\|\s*/).map(s => s.trim());

            const genresCreateMany: GenreTranslationCreateManyInput[] = genres.map((genre, index) => ({
                content: translatedNames[index] || genre.name,
                language,
                genreId: genre.id
            }));

            await db.genreTranslation.createMany({
                data: genresCreateMany,
                skipDuplicates: true
            });

            return translatedNames;
        } catch (error) {
            console.error("Erro na tradução de gêneros:", error);
            return genres.map(g => g.name);
        }
    },
    plot: async (plot: string, language: string, recommendedId: string) => {
        if (language === 'en') return plot;

        const existingTranslations = await db.translatedPlot.findUnique({
            where: {
                recommendedId_language: {
                    language,
                    recommendedId
                }
            }
        });

        if (existingTranslations) return existingTranslations.content;

        try {
            const translatedPlot = await translateText(plot, language);

            if (!translatedPlot) return plot;

            const savedPlot = await db.translatedPlot.create({ data: { content: translatedPlot, recommendedId, language } })

            return savedPlot.content
        } catch (error) {
            console.error("Erro na tradução do plot:", error);
            return plot
        }
    }
}