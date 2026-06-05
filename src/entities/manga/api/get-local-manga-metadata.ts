import { getMangaMetadata } from "@/shared/api";
import type { Manga, MangaMetadataFile } from "../model/types";

export async function getLocalMangaMetadata(id: string): Promise<Manga | null> {
  const raw = (await getMangaMetadata(id)) as MangaMetadataFile | null;
  return raw;
}
