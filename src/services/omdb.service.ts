
export const omdbService = {
    async getSerie<T>(title: string, year?: string): Promise<T> {
        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${title}${year ? '&' + year : ''}&plot=full&type:series&apikey=${process.env.OMDB_API_KEY!}`)

            return response.json() as T;
        } catch (error: any) {
            throw new Error('Erro na API OMDB', error);
        }
    },
    async getMovie<T>(title: string, year?: string): Promise<T> {
        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${title}${year ? '&' + year : ''}&plot=full&type:movie&apikey=${process.env.OMDB_API_KEY!}`)

            return response.json() as T;
        } catch (error: any) {
            throw new Error('Erro na API OMDB', error);
        }
    }
};