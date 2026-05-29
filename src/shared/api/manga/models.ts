import type { components, operations } from "./v1";

export type Manga = components["schemas"]["manga"];
export type TopMangaQuery = operations["getTopManga"]["parameters"]["query"];
export type MangaSearchQuery = operations["getMangaSearch"]["parameters"]["query"];
