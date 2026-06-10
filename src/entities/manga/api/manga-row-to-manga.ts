import { File } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";
import type { MangaRow } from "@db/schema";
import type { Manga } from "../model/types";

export function mangaRowToManga(row: MangaRow): Manga {
  let authors: { id: number; name: string }[] = [];
  try {
    const parsed = JSON.parse(row.authors);
    if (Array.isArray(parsed)) authors = parsed;
  } catch {}

  const coverUrl =
    row.coverUpdatedAt != null
      ? `${new File(mangaLibraryDir, row.id, "cover.jpg").uri}?v=${row.coverUpdatedAt}`
      : null;

  return {
    id: row.id,
    malId: row.malId,
    title: row.title,
    coverUrl,
    score: row.score,
    status: row.status,
    authors,
    synopsis: row.synopsis,
  };
}
