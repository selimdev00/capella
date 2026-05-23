import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: SSR on a Worker, assets served from the ASSETS binding.
// No incremental cache override - the dashboard reads a single upstream API
// and relies on Next's fetch cache, so R2/KV caching is unnecessary here.
export default defineCloudflareConfig();
