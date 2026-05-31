import { Directory } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export function deleteManga(id: string): void {
  const dir = new Directory(mangaLibraryDir, id);
  if (!dir.exists) return;
  dir.delete();
}
