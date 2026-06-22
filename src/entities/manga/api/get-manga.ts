import { JikanClient } from "@/shared/api";
import { mapJikanManga } from "../model/mapper";
import type { Manga, MangaQuery } from "../model/types";

export const getManga = async (id: number): Promise<Manga | null> => {
  const query: MangaQuery = { id };
  const result = await JikanClient("/manga/{id}", { params: { path: query } });
  if (result.error) {
    console.warn(
      `[jikan] GET /manga/${id} failed`,
      result.error,
      result.response.status,
    );
  }
  const raw = result.data?.data;
  return raw ? mapJikanManga(raw) : null;
};
