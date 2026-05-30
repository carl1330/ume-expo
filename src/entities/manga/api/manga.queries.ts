import {
  infiniteQueryOptions,
  queryOptions,
} from "@tanstack/react-query";
import { getTopManga } from "./get-top-manga";
import { getMangaSearch } from "./get-manga-search";
import { getManga } from "./get-manga";

export const mangaQueries = {
  all: () => ["manga"],
  lists: () => [...mangaQueries.all(), "list"],
  topList: () =>
    infiniteQueryOptions({
      queryKey: [...mangaQueries.lists(), "top"],
      queryFn: ({ pageParam }) => getTopManga(pageParam, undefined, "manga"),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.pagination.has_next_page ? lastPageParam + 1 : undefined,
    }),
  searches: () => [...mangaQueries.all(), "search"],
  search: (query: string) =>
    infiniteQueryOptions({
      queryKey: [...mangaQueries.searches(), query],
      queryFn: ({ pageParam }) =>
        getMangaSearch({ q: query, page: pageParam, sfw: true, type: "manga" }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, _, lastPageParam) =>
        lastPage.pagination.has_next_page ? lastPageParam + 1 : undefined,
      enabled: query.length > 0,
    }),
  details: () => [...mangaQueries.all(), "detail"],
  detail: (id: number) =>
    queryOptions({
      queryKey: [...mangaQueries.all(), id],
      queryFn: () => getManga(id),
    }),
  searchTop: (query: string) =>
    queryOptions({
      queryKey: [...mangaQueries.searches(), "top", query],
      queryFn: () =>
        getMangaSearch({ q: query, page: 1, limit: 10, sfw: true, type: "manga" }),
      enabled: query.length > 0,
    }),
};
