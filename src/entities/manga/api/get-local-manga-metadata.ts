import { eq } from "drizzle-orm";
import { db } from "@/shared/lib";
import { manga } from "@db/schema";
import type { Manga } from "../model/types";
import { mangaRowToManga } from "./manga-row-to-manga";

export async function getLocalMangaMetadata(id: string): Promise<Manga | null> {
  const rows = await db.select().from(manga).where(eq(manga.id, id)).limit(1);
  const row = rows[0];
  return row ? mangaRowToManga(row) : null;
}
