
export const googleBooks = {
    async getBook<T>(title: string, author: string): Promise<T> {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&orderBy=relevance&key=${Bun.env.GOOGLE_BOOK_KEY}`)

            return response.json() as T;
        } catch (error: any) {
            throw new Error('Erro na API GoogleBooks', error);
        }
    }
};