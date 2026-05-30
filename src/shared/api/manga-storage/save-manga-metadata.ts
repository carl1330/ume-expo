import { Directory, File } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export function saveMangaMetadata(id: string, data: unknown): void {
  const mangaDir = new Directory(mangaLibraryDir, id);
  if (!mangaDir.exists) {
    mangaDir.create();
  }
  const file = new File(mangaDir, "metadata.json");
  file.write(JSON.stringify(data));
}
