import { eq, sql } from "drizzle-orm";
import type { QueryClient } from "@tanstack/react-query";
import { db } from "@/shared/lib";
import { manga } from "@db/schema";
import { downloadMangaCover } from "./download-manga-cover";
import { getMangaSearch } from "./get-manga-search";
import { localMangaQueries } from "./manga-local.queries";

export async function syncMangaMetadataByTitle(
  id: string,
  title: string,
  queryClient: QueryClient,
): Promise<void> {
  const result = await getMangaSearch({
    q: title,
    page: 1,
    sfw: true,
    type: "manga",
  });
  const match = result.manga[0];
  if (!match) return;

  const patch: Record<string, unknown> = {
    malId: match.malId,
    score: match.score,
    status: match.status,
    authors: JSON.stringify(match.authors),
    updatedAt: new Date(),
  };

  if (match.coverUrl) {
    await downloadMangaCover(id, match.coverUrl);
    patch.coverUpdatedAt = sql`(unixepoch())`;
  }

  await db.update(manga).set(patch).where(eq(manga.id, id));

  await queryClient.invalidateQueries({
    queryKey: localMangaQueries.metadata(id).queryKey,
  });
  await queryClient.invalidateQueries({
    queryKey: localMangaQueries.list().queryKey,
  });
}
