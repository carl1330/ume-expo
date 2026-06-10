import { desc } from "drizzle-orm";
import { db } from "@/shared/lib";
import { manga } from "@db/schema";
import type { Manga } from "../model/types";
import { mangaRowToManga } from "./manga-row-to-manga";

export async function listManga(): Promise<Manga[]> {
  const rows = await db.select().from(manga).orderBy(desc(manga.createdAt));
  return rows.map(mangaRowToManga);
}
