import { Directory, File } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export async function getMangaMetadata(id: string): Promise<unknown | null> {
  const mangaDir = new Directory(mangaLibraryDir, id);
  const file = new File(mangaDir, "metadata.json");
  if (!file.exists) return null;
  try {
    return JSON.parse(await file.text());
  } catch {
    return null;
  }
}
