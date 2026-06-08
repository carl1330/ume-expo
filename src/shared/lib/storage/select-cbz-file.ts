import { File } from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";

export async function selectCbzFile(): Promise<File | null> {
  const result = await getDocumentAsync({
    type: ["application/zip", "application/x-cbz", "application/octet-stream"],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;

  if (!/\.(cbz|zip)$/i.test(asset.name)) return null;

  return new File(asset.uri);
}
