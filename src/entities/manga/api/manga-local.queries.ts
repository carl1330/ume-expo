import { queryOptions } from "@tanstack/react-query";
import { listManga } from "./list-manga";
import { getLocalMangaMetadata } from "./get-local-manga-metadata";

export const localMangaQueries = {
  all: () => ["manga", "local"],
  list: () =>
    queryOptions({
      queryKey: [...localMangaQueries.all(), "list"],
      queryFn: () => listManga(),
    }),
  metadata: (id: string) =>
    queryOptions({
      queryKey: [...localMangaQueries.all(), "metadata", id],
      queryFn: () => getLocalMangaMetadata(id),
      retry: false,
    }),
};
