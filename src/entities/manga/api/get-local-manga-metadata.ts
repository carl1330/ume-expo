import { getMangaMetadata } from "@/shared/api";
import type { Manga } from "../model/types";

export async function getLocalMangaMetadata(id: string): Promise<Manga | null> {
  const raw = await getMangaMetadata(id);
  if (raw) return raw as Manga;
  return null;
}
