import { Directory, File } from "expo-file-system";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

export function getVolumePages(volumeDir: Directory): File[] {
  return volumeDir
    .list()
    .filter((entry): entry is File => entry instanceof File)
    .filter((file) => IMAGE_EXTENSIONS.has(file.extension.replace(".", "").toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
}
