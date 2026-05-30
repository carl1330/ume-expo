import { downloadMangaCover, getMangaMetadata, saveMangaMetadata } from "@/shared/api";
import type { QueryClient } from "@tanstack/react-query";
import { getMangaSearch } from "./get-manga-search";
import { localMangaQueries } from "./manga-local.queries";

export async function syncMangaMetadataByTitle(
  id: string,
  title: string,
  queryClient: QueryClient,
): Promise<void> {
  const result = await getMangaSearch({ q: title, page: 1, sfw: true, type: "manga" });
  const match = result.manga[0];
  if (!match) return;

  const existing = await getMangaMetadata(id);
  if (!existing) return;

  const coverUri = match.coverUrl
    ? await downloadMangaCover(id, match.coverUrl)
    : null;

  const updated = {
    ...(existing as object),
    malId: match.malId,
    coverUrl: coverUri,
    score: match.score,
    status: match.status,
    authors: match.authors,
  };
  saveMangaMetadata(id, updated);

  await queryClient.invalidateQueries({
    queryKey: localMangaQueries.metadata(id).queryKey,
  });
}
