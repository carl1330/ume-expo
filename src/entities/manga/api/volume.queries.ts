import { queryOptions } from "@tanstack/react-query";
import { Directory } from "expo-file-system";
import { listVolumes, getVolumePages } from "@/shared/api";
import type { VolumeDir, VolumePage } from "../model/types";

export const volumeQueries = {
  all: () => ["volume"],
  byManga: (id: string) =>
    queryOptions({
      queryKey: [...volumeQueries.all(), id],
      queryFn: (): VolumeDir[] => listVolumes(id),
    }),
  pages: (volumeDir: Directory) =>
    queryOptions({
      queryKey: [...volumeQueries.all(), "pages", volumeDir.uri],
      queryFn: (): VolumePage[] => getVolumePages(volumeDir),
    }),
};
