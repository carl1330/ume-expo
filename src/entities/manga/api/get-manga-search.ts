import { JikanClient } from "@/shared/api";
import { mapJikanManga } from "../model/mapper";
import type { MangaSearchQuery, MangaWithPagination } from "../model/types";

export const getMangaSearch = async (
  query: MangaSearchQuery,
): Promise<MangaWithPagination> => {
  const result = await JikanClient("/manga", { params: { query } });

  return {
    manga: (result.data?.data ?? []).map((raw) => mapJikanManga(raw)),
    pagination: {
      current_page: result.data?.pagination?.current_page ?? 1,
      has_next_page: result.data?.pagination?.has_next_page ?? false,
    },
  };
};
