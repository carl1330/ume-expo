import { JikanClient } from "@/shared/api";
import { MangaWithPagination } from "./manga-with-pagination";
import { TopMangaQuery } from "./models";

export const getTopManga = async (
  page: number,
  filter: "publishing" | "upcoming" | "bypopularity" | "favorite" | undefined,
  type:
    | "manga"
    | "novel"
    | "lightnovel"
    | "oneshot"
    | "doujin"
    | "manhwa"
    | "manhua"
    | undefined,
): Promise<MangaWithPagination> => {
  const query: TopMangaQuery = { page, filter, type };
  const result = await JikanClient("/top/manga", { params: { query } });

  const pagination = {
    current_page: result.data?.pagination?.current_page ?? 1,
    has_next_page: result.data?.pagination?.has_next_page ?? false,
  };

  return {
    manga: result.data?.data ?? [],
    pagination,
  };
};
