import { infiniteQueryOptions } from "@tanstack/react-query";
import { getTopManga } from "./get-top-manga";
import { getMangaSearch } from "./get-manga-search";

export const mangaQueries = {
  all: () => ["manga"],
  lists: () => [...mangaQueries.all(), "list"],
  topList: () =>
    infiniteQueryOptions({
      queryKey: [...mangaQueries.lists(), "top"],
      queryFn: ({ pageParam }) => getTopManga(pageParam, undefined, "manga"),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.pagination.has_next_page
          ? lastPageParam + 1
          : undefined,
    }),
  search: (query: string) =>
    infiniteQueryOptions({
      queryKey: [...mangaQueries.lists(), "search", query],
      queryFn: ({ pageParam }) =>
        getMangaSearch({ q: query, page: pageParam, sfw: true }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.pagination.has_next_page
          ? lastPageParam + 1
          : undefined,
      enabled: query.length > 0,
    }),
};
