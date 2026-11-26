/**
 * Uygulama sürümü — package.json'daki `version` (next.config.ts derleme anında gömer).
 * Sürüm yükseltirken yalnızca package.json + CHANGELOG.md güncellenir (AGENTS.md §2); panel kendiliğinden yeni sürümü gösterir.
 */
export const APP_VERSION: string = process.env.NEXT_PUBLIC_APP_VERSION ?? "";
