import { eq } from "drizzle-orm";
import { db } from "@/shared/lib";
import { manga } from "@db/schema";

export async function findMangaByMalId(malId: number): Promise<string | null> {
  const rows = await db
    .select({ id: manga.id })
    .from(manga)
    .where(eq(manga.malId, malId))
    .limit(1);
  return rows[0]?.id ?? null;
}
