import {
  getMangaMetadata,
  listVolumes,
  resolveVolumeCoverUri,
} from "@/shared/api";
import type { MangaMetadataFile, Volume } from "../model/types";

export async function getMangaVolumes(id: string): Promise<Volume[]> {
  const meta = (await getMangaMetadata(id)) as MangaMetadataFile | null;
  const cache = meta?.volumes ?? {};
  return listVolumes(id).map((dir) => ({
    dir,
    cover: resolveVolumeCoverUri(dir, cache[dir.name]?.cover ?? null),
  }));
}
