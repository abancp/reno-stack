import { authClient } from "./auth-client";
import type { Session } from "./auth-client";

export const sessionFetcher = async ():Promise<Session | null>=>{
    const result = await authClient.getSession()
    return result.data ?? null
}