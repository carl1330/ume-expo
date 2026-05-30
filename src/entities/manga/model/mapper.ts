import type { JikanComponents } from "@/shared/api";
import type { Manga } from "./types";

type JikanManga = JikanComponents["schemas"]["manga"];

export function mapJikanManga(raw: JikanManga, coverUrl?: string): Manga {
  return {
    id: "",
    malId: raw.mal_id ?? null,
    title: raw.title ?? "",
    coverUrl: coverUrl ?? raw.images?.jpg?.image_url ?? null,
    score: raw.score ?? null,
    status: raw.status ?? null,
    authors: (raw.authors ?? [])
      .filter((a) => a.mal_id != null && a.name != null)
      .map((a) => ({ id: a.mal_id!, name: a.name! })),
  };
}
