import { queryOptions } from "@tanstack/react-query";
import { Directory } from "expo-file-system";
import { getVolumePages } from "@/shared/api";
import type { VolumePage } from "../model/types";
import { getMangaVolumes } from "./get-manga-volumes";

export const volumeQueries = {
  all: () => ["volume"],
  byManga: (id: string) =>
    queryOptions({
      queryKey: [...volumeQueries.all(), id],
      queryFn: () => getMangaVolumes(id),
    }),
  pages: (volumeDir: Directory) =>
    queryOptions({
      queryKey: [...volumeQueries.all(), "pages", volumeDir.uri],
      queryFn: (): VolumePage[] => getVolumePages(volumeDir),
    }),
};
