import { queryOptions } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/shared/lib";
import { volumeProgress, type VolumeProgress } from "@db/schema";

async function getVolumeProgress(
  volumeUuid: string,
): Promise<VolumeProgress | null> {
  const rows = await db
    .select()
    .from(volumeProgress)
    .where(eq(volumeProgress.volumeUuid, volumeUuid))
    .limit(1);
  return rows[0] ?? null;
}

export const progressQueries = {
  all: () => ["progress"],
  byVolume: (volumeUuid: string) =>
    queryOptions({
      queryKey: [...progressQueries.all(), volumeUuid],
      queryFn: () => getVolumeProgress(volumeUuid),
    }),
};
