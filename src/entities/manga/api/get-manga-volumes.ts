import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/lib";
import { volume } from "@db/schema";
import type { Volume } from "../model/types";
import { volumeRowToVolume } from "./volume-row-to-volume";

export async function getMangaVolumes(mangaId: string): Promise<Volume[]> {
  const rows = await db
    .select()
    .from(volume)
    .where(eq(volume.mangaId, mangaId))
    .orderBy(asc(volume.dirName));
  return rows.map(volumeRowToVolume);
}
