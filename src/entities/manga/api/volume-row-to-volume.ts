import { Directory, File } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";
import type { VolumeRow } from "@db/schema";
import type { Volume } from "../model/types";

export function volumeRowToVolume(row: VolumeRow): Volume {
  const dir = new Directory(mangaLibraryDir, row.mangaId, row.dirName);
  const segments = row.coverPath.split("/").filter(Boolean);
  return {
    dir,
    uuid: row.uuid,
    cover: new File(dir, ...segments).uri,
  };
}
