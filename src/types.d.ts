export interface OmdbResponse {
  Title: string
  Year: string
  Writer: string
  Poster: string
  imdbRating: string
  Genre: string
  Plot: string
}

export interface SaveRecommended {
  title: string,
  img: string,
  plot: string,
  year: string,
  creator: string,
  rating?: string,
  genres: string[],
  categoryId: number,
  link?: string
}

export interface SavePayment {
  userId: string,
  externalId: string,
  productId: string,
  status: string
}

declare global {
  namespace PrismaJson {
    type PersonTraits = Record<string, string>
    type PersonDesc = Record<string, string>
    type CategoryTitle = Record<string, string>
  }
}

export { }