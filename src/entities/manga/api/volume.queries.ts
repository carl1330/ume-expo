import { queryOptions } from "@tanstack/react-query";
import { Directory } from "expo-file-system";
import { getMangaVolumes } from "./get-manga-volumes";
import { getVolumeContent } from "./get-volume-content";

export const volumeQueries = {
  all: () => ["volume"],
  byManga: (id: string) =>
    queryOptions({
      queryKey: [...volumeQueries.all(), id],
      queryFn: () => getMangaVolumes(id),
    }),
  content: (dir: Directory) =>
    queryOptions({
      queryKey: [...volumeQueries.all(), "content", dir.uri],
      queryFn: () => getVolumeContent(dir),
    }),
};
