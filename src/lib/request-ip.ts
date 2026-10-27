const LOCAL_CLIENT_KEY = "local";

/**
 * Key for the chat rate limit.
 * Cloudflare sets cf-connecting-ip and overwrites any client-supplied value.
 * x-forwarded-for and x-real-ip are not read.
 * Local dev has no Cloudflare header, so every request shares "local".
 */
export function getClientIp(headers: Headers): string {
  const value = headers.get("cf-connecting-ip");
  if (value == null) return LOCAL_CLIENT_KEY;
  const trimmed = value.trim();
  if (trimmed === "") return LOCAL_CLIENT_KEY;
  return trimmed;
}
