import { Directory, File } from "expo-file-system";
import { mangaLibraryDir } from "@/shared/config";

export function listVolumes(id: string): Directory[] {
  const mangaDir = new Directory(mangaLibraryDir, id);
  const result = mangaDir
    .list()
    .filter((entry): entry is Directory => entry instanceof Directory);

  return result;
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|bmp|avif)$/i;

export function getVolumeCoverFilename(volumeDir: Directory): string | null {
  let first: File | null = null;
  for (const entry of volumeDir.list()) {
    if (!(entry instanceof File)) continue;
    if (!IMAGE_EXT.test(entry.name)) continue;
    if (
      first === null ||
      entry.name.localeCompare(first.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }) < 0
    ) {
      first = entry;
    }
  }
  return first?.name ?? null;
}

export function resolveVolumeCoverUri(
  volumeDir: Directory,
  filename: string | null,
): string | null {
  if (!filename) return null;
  return new File(volumeDir, filename).uri;
}
