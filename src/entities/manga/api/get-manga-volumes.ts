import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/lib";
import { volume, volumeProgress } from "@db/schema";
import type { Volume } from "../model/types";
import { volumeRowToVolume } from "./volume-row-to-volume";

export async function getMangaVolumes(mangaId: string): Promise<Volume[]> {
  const rows = await db.query.volume.findMany({
    where: eq(volume.mangaId, mangaId),
    orderBy: asc(volume.dirName),
    with: {
      progress: true,
    },
  });
  return rows.map(volumeRowToVolume);
}
