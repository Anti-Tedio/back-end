import { redis } from "bun"
import { sign } from "hono/jwt"

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'chave secreta'

export const manageRefreshToken = {
    generate: async (id: string, isAdmin?: boolean) => {
        const payload = {
            id,
            isAdmin:isAdmin??null,
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
        }

        const token = await sign(payload, REFRESH_SECRET, 'HS256')

        return token
    },
    save: async (id: string, token: string) => {
        await redis.set(`refresh_token:${id}`, token);
        await redis.expire(`refresh_token:${id}`, 60 * 60 * 24 * 7)
    },
    remove: async (id: string) => {
        await redis.del(`refresh_token:${id}`)
    },
    verify: async (id: string, token: string): Promise<boolean> => {
        const tokenRedis = await redis.get(`refresh_token:${id}`);
        if (tokenRedis != token) return false;
        return true;
    }
}