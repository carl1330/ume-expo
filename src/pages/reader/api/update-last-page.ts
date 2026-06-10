import { eq, sql } from "drizzle-orm";
import { db } from "@/shared/lib";
import { volumeProgress } from "@db/schema";

export async function updateLastPage(params: {
  volumeUuid: string;
  page: number;
  totalPages: number;
}) {
  const isFinal = params.page >= params.totalPages - 1;
  await db
    .update(volumeProgress)
    .set({
      lastPage: params.page,
      updatedAt: new Date(),
      ...(isFinal && {
        completedAt: sql`coalesce(${volumeProgress.completedAt}, unixepoch())`,
      }),
    })
    .where(eq(volumeProgress.volumeUuid, params.volumeUuid));
  return params;
}
