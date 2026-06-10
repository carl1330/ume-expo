import { useCallback, useState } from "react";
import { Directory, Paths } from "expo-file-system";
import { useQueryClient } from "@tanstack/react-query";
import { selectCbzFile } from "@/shared/lib";
import { mangaLibraryDir } from "@/shared/config";
import { localMangaQueries } from "./manga-local.queries";
import { saveMangaMetadata } from "@/shared/api";
import { readMokuroFile } from "./read-mokuro-file";
import { syncMangaMetadataByTitle } from "./sync-manga-metadata";
import { extractCbz } from "./extract-cbz";
import { createVolumeProgress } from "./create-volume-progress";

export type ImportStatus =
  | "idle"
  | "validating"
  | "importing"
  | "error"
  | "success";

export function useImportManga(targetId?: string) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [importedId, setImportedId] = useState<string | null>(null);

  const importManga = useCallback(async () => {
    setStatus("validating");
    setError(null);
    setImportedId(null);

    try {
      const cbz = await selectCbzFile();
      if (!cbz) {
        setStatus("idle");
        return;
      }

      const staging = makeStagingDir();
      staging.create({ intermediates: true });
      await extractCbz(cbz, staging);

      const mokuro = await readMokuroFile(staging);
      if (!mokuro) {
        setError("No valid manga found. Archive must contain a .mokuro file.");
        setStatus("error");
        return;
      }

      setStatus("importing");

      if (!mangaLibraryDir.exists) mangaLibraryDir.create();

      if (targetId) {
        const destDir = new Directory(mangaLibraryDir, targetId);
        if (!destDir.exists) destDir.create();

        await staging.copy(destDir);

        await createVolumeProgress({
          volumeUuid: mokuro.volume_uuid,
          mangaId: targetId,
          totalPages: mokuro.pages.length,
        });

        setImportedId(targetId);
        setStatus("success");
      } else {
        const { title_uuid: uuid, title } = mokuro;

        const destDir = new Directory(mangaLibraryDir, uuid);
        if (!destDir.exists) destDir.create();

        await staging.copy(destDir);

        await createVolumeProgress({
          volumeUuid: mokuro.volume_uuid,
          mangaId: uuid,
          totalPages: mokuro.pages.length,
        });

        saveMangaMetadata(uuid, {
          id: uuid,
          malId: null,
          title,
          coverUrl: null,
          score: null,
          status: null,
          authors: [],
        });

        await queryClient.invalidateQueries({
          queryKey: localMangaQueries.list().queryKey,
        });

        setImportedId(uuid);
        setStatus("success");

        syncMangaMetadataByTitle(uuid, title, queryClient).catch(() => {});
      }
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }, [queryClient, targetId]);

  return { importManga, status, error, importedId };
}

function makeStagingDir(): Directory {
  const id = `cbz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return new Directory(Paths.cache, "cbz-import", id);
}
