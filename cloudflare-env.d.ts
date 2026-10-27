interface ChatRateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface CloudflareEnv {
  CHAT_RATE_LIMITER: ChatRateLimitBinding;
}
