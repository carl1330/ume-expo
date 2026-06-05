import { Directory } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";
import type { Volume } from "../model/types";
import { readMokuroFile } from "./read-mokuro-file";

export async function getMangaVolumes(id: string): Promise<Volume[]> {
  const mangaDir = new Directory(mangaLibraryDir, id);
  if (!mangaDir.exists) return [];

  const dirs = mangaDir
    .list()
    .filter((entry): entry is Directory => entry instanceof Directory);

  const results = await Promise.all(
    dirs.map(async (dir): Promise<Volume | null> => {
      const mokuro = await readMokuroFile(dir);
      if (!mokuro) return null;

      const firstPage = mokuro.pages[0];

      if (!firstPage) return null;

      return {
        dir,
        uuid: mokuro.volume_uuid,
        cover: decodeURIComponent(dir.uri + firstPage.img_path),
      };
    }),
  );

  return results
    .filter((v): v is Volume => v !== null)
    .sort((a, b) => a.dir.name.localeCompare(b.dir.name));
}
