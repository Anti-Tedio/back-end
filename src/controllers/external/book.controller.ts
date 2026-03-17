import { googleBooks } from "../../services/googleBooks.service";
import { RecommendedCreateInput } from "../../../prisma/generated/models";

interface DataBook {
    items: {
        volumeInfo: {
            title: string,
            authors: string[],
            publishedDate: string,
            description: string,
            categories: string[]
            pageCount: number,
            imageLinks: {
                thumbnail: string
            },
            infoLink: string
        }
    }[]
}

export const bookController = {
    getBook: async (title: string, author: string, userId: string) => {

        const data = await googleBooks.getBook<DataBook>(title, author);

        const book = data.items[0]

        const recommendedCreate: RecommendedCreateInput = {
            title: book.volumeInfo.title,
            img: await getHighResThumbnail(book.volumeInfo.imageLinks.thumbnail),
            year: book.volumeInfo.publishedDate,
            plot: book.volumeInfo.description,
            creator: book.volumeInfo.authors.join(', '),
            link: book.volumeInfo.infoLink,
            category: { connect: { id: 6 } },
        }

        const genres = book.volumeInfo.categories;

        return { recommendedCreate, genres }
    },
}

async function getHighResThumbnail(img: string): Promise<string> {
    const bookUrl = new URL(img.replace(/zoom=\d/, 'zoom=3'))
    bookUrl.protocol = 'https:'
    bookUrl.searchParams.delete('edge')

    const highResUrl = bookUrl.toString()

    try {
        await new Promise((resolve, reject) => {
            const img = new Image()

            img.onload = () => {
                if (img.naturalWidth <= 1) {
                    reject()
                } else {
                    resolve(true)
                }
            }

            img.onerror = () => reject()

            img.src = highResUrl
        })

        return highResUrl
    } catch (error) {
        console.warn('Zoom=3 não disponível ou bloqueado. Usando original.')
        return img
    }
}