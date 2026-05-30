import { queryOptions } from "@tanstack/react-query";
import { getMangaMetadata, listManga } from "@/shared/api";
import type { Manga } from "../model/types";

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
      queryFn: async (): Promise<Manga | null> => {
        const raw = await getMangaMetadata(id);
        if (raw) return raw as Manga;
        return null;
      },
      retry: false,
    }),
};
