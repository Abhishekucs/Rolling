import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import FirebaseAdmin from "../init/firebase-admin";
import { LRUCache } from "lru-cache";

const tokenCache = new LRUCache<string, DecodedIdToken>({
  max: 20000,
  maxSize: 50000000, // 50MB
  sizeCalculation: (token, key): number =>
    JSON.stringify(token).length + key.length, //sizeInBytes
});

const TOKEN_CACHE_BUFFER = 1000 * 60 * 5; // 5 minutes

export async function verifyIdToken(
  idToken: string,
  noCache = false,
): Promise<DecodedIdToken> {
  if (noCache) {
    return await FirebaseAdmin().auth().verifyIdToken(idToken, true);
  }

  const cached = tokenCache.get(idToken);
  if (cached) {
    const expirationDate = cached.exp * 1000 - TOKEN_CACHE_BUFFER;

    if (expirationDate < Date.now()) {
      //recordTokenCacheAccess("hit_expired");
      tokenCache.delete(idToken);
    } else {
      //recordTokenCacheAccess("hit");
      return cached;
    }
  } else {
    //recordTokenCacheAccess("miss");
  }

  const decoded = await FirebaseAdmin().auth().verifyIdToken(idToken, true);
  tokenCache.set(idToken, decoded);
  return decoded;
}
