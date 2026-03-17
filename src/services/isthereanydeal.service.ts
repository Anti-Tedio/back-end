
export const isthereanydealService = {
    async getIdGame<T>(title: string): Promise<T> {
        try {
            const response = await fetch(`https://api.isthereanydeal.com/games/search/v1?title=${title}&key=${process.env.ISTHEREANYDEAL_API_KEY!}&results=1`)

            return response.json() as T;
        } catch (error: any) {
            console.error('Erro na API Isthereanydeal:', error)
            throw new error
        }
    },
    async getInfoGame<T>(id: string): Promise<T> {
        try {
            const response = await fetch(`https://api.isthereanydeal.com/games/info/v2?id=${id}&key=${process.env.ISTHEREANYDEAL_API_KEY!}`)

            return response.json() as T;
        } catch (error: any) {
            console.error('Erro na API Isthereanydeal:', error)
            throw new error
        }
    },
    async getPriceGame<T>(id: string,idShop:number): Promise<T> {
        try {
            const response = await fetch(`https://api.isthereanydeal.com/games/history/v2?id=${id}&shops=${idShop}&key=${process.env.ISTHEREANYDEAL_API_KEY!}&country=BR`)

            return response.json() as T;
        } catch (error: any) {
            console.error('Erro na API Isthereanydeal:', error)
            throw new error
        }
    }
};