import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getMangaMetadata,
  getVolumeCoverFilename,
  resolveVolumeCoverUri,
  saveMangaMetadata,
} from "@/shared/api";
import type { MangaMetadataFile, Volume } from "../model/types";
import { volumeQueries } from "./volume.queries";
import { localMangaQueries } from "./manga-local.queries";

const yieldToUi = () => new Promise<void>((r) => setTimeout(r, 0));

export function useFillVolumeCovers(mangaId: string, volumes: Volume[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const missing = volumes.filter((v) => v.cover === null);
    if (missing.length === 0) return;

    let cancelled = false;

    (async () => {
      const computed: Record<string, string> = {};

      for (const volume of missing) {
        if (cancelled) return;
        await yieldToUi();
        if (cancelled) return;

        const filename = getVolumeCoverFilename(volume.dir);
        if (!filename) continue;

        computed[volume.dir.name] = filename;
        const uri = resolveVolumeCoverUri(volume.dir, filename);

        queryClient.setQueryData<Volume[]>(
          volumeQueries.byManga(mangaId).queryKey,
          (prev) =>
            prev?.map((v) =>
              v.dir.name === volume.dir.name ? { ...v, cover: uri } : v,
            ),
        );
      }

      if (cancelled || Object.keys(computed).length === 0) return;

      const existing =
        ((await getMangaMetadata(mangaId)) as MangaMetadataFile | null) ?? null;
      if (!existing) return;

      const mergedVolumes = { ...(existing.volumes ?? {}) };
      for (const [name, cover] of Object.entries(computed)) {
        mergedVolumes[name] = { cover };
      }

      saveMangaMetadata(mangaId, { ...existing, volumes: mergedVolumes });

      await queryClient.invalidateQueries({
        queryKey: localMangaQueries.metadata(mangaId).queryKey,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [mangaId, volumes, queryClient]);
}
