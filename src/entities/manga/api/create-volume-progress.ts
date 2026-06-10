import { db } from "@/shared/lib";
import { volumeProgress } from "@db/schema";

export async function createVolumeProgress(params: {
  volumeUuid: string;
  mangaId: string;
  totalPages: number;
}) {
  await db
    .insert(volumeProgress)
    .values({
      volumeUuid: params.volumeUuid,
      mangaId: params.mangaId,
      totalPages: params.totalPages,
      lastPage: 0,
    })
    .onConflictDoNothing();
}
