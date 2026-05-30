import { Directory } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export function listVolumes(id: string): Directory[] {
  const mangaDir = new Directory(mangaLibraryDir, id);
  return mangaDir
    .list()
    .filter((entry): entry is Directory => entry instanceof Directory);
}
