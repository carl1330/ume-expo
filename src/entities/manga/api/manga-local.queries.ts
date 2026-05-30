import { queryOptions } from "@tanstack/react-query";
import { listManga } from "@/shared/api";
import { getLocalMangaMetadata } from "./get-local-manga-metadata";

export const localMangaQueries = {
  all: () => ["manga", "local"],
  list: () =>
    queryOptions({
      queryKey: [...localMangaQueries.all(), "list"],
      queryFn: (): string[] => listManga(),
    }),
  metadata: (id: string) =>
    queryOptions({
      queryKey: [...localMangaQueries.all(), "metadata", id],
      queryFn: () => getLocalMangaMetadata(id),
      retry: false,
    }),
};
