import { eq, sql } from "drizzle-orm";
import { db } from "@/shared/lib";
import { manga } from "@db/schema";
import { downloadMangaCover } from "./download-manga-cover";

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
  const patch: Record<string, unknown> = {
    title,
    malId,
    updatedAt: new Date(),
  };

  if (jikanPreview) {
    patch.score = jikanPreview.score;
    patch.status = jikanPreview.status;
    patch.authors = JSON.stringify(jikanPreview.authors);

    if (jikanPreview.coverUrl) {
      await downloadMangaCover(id, jikanPreview.coverUrl);
      patch.coverUpdatedAt = sql`(unixepoch())`;
    }
  }

  await db.update(manga).set(patch).where(eq(manga.id, id));
}
