import { Directory } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export function listManga(): string[] {
  if (!mangaLibraryDir.exists) return [];
  return mangaLibraryDir
    .list()
    .filter((entry): entry is Directory => entry instanceof Directory)
    .map((dir) => dir.name);
}
