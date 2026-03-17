import { isthereanydealService } from "../services/isthereanydeal.service";

export async function getPriceVideoGame(title: string, store: string, gameId?: string, appId?:number) {

    let storeId: number

    gameId = gameId ?? (await isthereanydealService.getIdGame<{ id: string }[]>(title))[0].id;

    switch (store.toLowerCase().trim()) {
        case 'steam':
            storeId = 61;
            break;
        case 'epic game store':
            storeId = 16;
            break;
        case 'gog':
            storeId = 35;
            break;
        case 'nuuvem':
            storeId = 50;
            break;
        default:
            storeId = 61;
            break;
    }

    const priceGame = await isthereanydealService.getPriceGame<{ shop: { name: string }, deal: { price: { amount: number } } }[]>(gameId, storeId)

    appId = appId ?? (await isthereanydealService.getInfoGame<{ appid: number }>(gameId)).appid;

    const { shop, deal } = priceGame[0]

    const price = {
        store: shop.name,
        price: deal.price.amount,
        idSteam: appId
    }

    return price
}