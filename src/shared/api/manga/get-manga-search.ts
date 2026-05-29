import { JikanClient } from "@/shared/api";
import { MangaWithPagination } from "./manga-with-pagination";
import type { MangaSearchQuery } from "./models";

export const getMangaSearch = async (
  query: MangaSearchQuery,
): Promise<MangaWithPagination> => {
  const result = await JikanClient("/manga", { params: { query } });

  return {
    manga: result.data?.data ?? [],
    pagination: {
      current_page: result.data?.pagination?.current_page ?? 1,
      has_next_page: result.data?.pagination?.has_next_page ?? false,
    },
  };
};
