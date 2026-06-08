import { Directory, File } from "expo-file-system";
import { unzipSync } from "fflate";

export async function extractCbz(
  cbz: File,
  destDir: Directory,
): Promise<void> {
  const bytes = await cbz.bytes();
  const entries = unzipSync(bytes);

  for (const [path, data] of Object.entries(entries)) {
    if (path.endsWith("/") || data.length === 0) continue;

    const segments = path.split("/").filter(Boolean);
    const fileName = segments.pop();
    if (!fileName) continue;

    const parent =
      segments.length > 0 ? new Directory(destDir, ...segments) : destDir;
    if (segments.length > 0 && !parent.exists) {
      parent.create({ intermediates: true });
    }

    const out = new File(parent, fileName);
    out.create({ overwrite: true });
    out.write(data);
  }
}
