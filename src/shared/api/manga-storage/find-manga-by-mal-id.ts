import { listManga } from "./list-manga";
import { getMangaMetadata } from "./get-manga-metadata";

export async function findMangaByMalId(malId: number): Promise<string | null> {
  const ids = listManga();
  for (const id of ids) {
    const meta = await getMangaMetadata(id);
    if (meta && typeof meta === "object" && (meta as { malId?: unknown }).malId === malId) {
      return id;
    }
  }
  return null;
}
