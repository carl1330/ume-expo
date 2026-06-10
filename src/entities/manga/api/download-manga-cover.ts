import { Directory, File } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export async function downloadMangaCover(
  id: string,
  url: string,
): Promise<string> {
  if (!url) return "";
  const mangaDir = new Directory(mangaLibraryDir, id);
  if (!mangaDir.exists) mangaDir.create({ intermediates: true });
  const coverFile = new File(mangaDir, "cover.jpg");
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  coverFile.write(new Uint8Array(buffer));
  return coverFile.uri;
}
