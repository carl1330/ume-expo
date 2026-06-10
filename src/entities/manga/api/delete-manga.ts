import { Directory } from "expo-file-system";
import { eq } from "drizzle-orm";
import { db } from "@/shared/lib";
import { manga } from "@db/schema";
import { mangaLibraryDir } from "@/shared/config";

export async function deleteManga(id: string): Promise<void> {
  await db.delete(manga).where(eq(manga.id, id));
  const dir = new Directory(mangaLibraryDir, id);
  if (dir.exists) dir.delete();
}
