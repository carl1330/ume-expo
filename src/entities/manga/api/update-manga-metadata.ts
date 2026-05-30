import {
  downloadMangaCover,
  getMangaMetadata,
  saveMangaMetadata,
} from "@/shared/api";
import type { MangaMetadataFile } from "../model/types";

export type JikanPreview = {
  score: number | null;
  status: string | null;
  authors: { id: number; name: string }[];
  coverUrl: string | null;
};

type UpdateInput = {
  id: string;
  title: string;
  malId: number | null;
  jikanPreview: JikanPreview | null;
};

export async function updateMangaMetadata({
  id,
  title,
  malId,
  jikanPreview,
}: UpdateInput): Promise<void> {
  console.log(id, title, malId, jikanPreview);

  const existing = ((await getMangaMetadata(id)) ??
    {}) as Partial<MangaMetadataFile>;

  let coverUrl = existing.coverUrl ?? null;
  let score = existing.score ?? null;
  let status = existing.status ?? null;
  let authors = existing.authors ?? [];

  if (jikanPreview) {
    score = jikanPreview.score;
    status = jikanPreview.status;
    authors = jikanPreview.authors;
    if (jikanPreview.coverUrl) {
      const fileUri = await downloadMangaCover(id, jikanPreview.coverUrl);
      coverUrl = `${fileUri}?v=${Date.now()}`;
    }
  }

  const updated: MangaMetadataFile = {
    ...existing,
    id,
    title,
    malId,
    coverUrl,
    score,
    status,
    authors,
  };

  saveMangaMetadata(id, updated);
}
