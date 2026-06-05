import { useCallback, useState } from "react";
import { Directory } from "expo-file-system";
import { useQueryClient } from "@tanstack/react-query";
import { selectDirectory } from "@/shared/lib";
import { mangaLibraryDir } from "@/shared/config";
import { localMangaQueries } from "@/entities/manga";
import { saveMangaMetadata } from "@/shared/api";
import { readMokuroFile } from "./read-mokuro-file";
import { syncMangaMetadataByTitle } from "./sync-manga-metadata";

export type ImportStatus =
  | "idle"
  | "validating"
  | "importing"
  | "error"
  | "success";

export function useImportMangaDirectory(targetId?: string) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [importedId, setImportedId] = useState<string | null>(null);

  const importDirectory = useCallback(async () => {
    setStatus("validating");
    setError(null);
    setImportedId(null);

    try {
      const dir = await selectDirectory();
      if (!dir) {
        setStatus("idle");
        return;
      }

      const mokuro = await readMokuroFile(dir);
      if (!mokuro) {
        setError(
          "No valid manga found. Directory must contain a subfolder with a .mokuro file.",
        );
        setStatus("error");
        return;
      }

      setStatus("importing");

      if (!mangaLibraryDir.exists) mangaLibraryDir.create();

      if (targetId) {
        const destDir = new Directory(mangaLibraryDir, targetId);
        if (!destDir.exists) destDir.create();

        await dir.copy(destDir);

        setImportedId(targetId);
        setStatus("success");
      } else {
        const { title_uuid: uuid, title } = mokuro;

        const destDir = new Directory(mangaLibraryDir, uuid);
        if (!destDir.exists) destDir.create();

        await dir.copy(destDir);

        saveMangaMetadata(uuid, {
          id: uuid,
          malId: null,
          title: mokuro.title,
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

  return { importDirectory, status, error, importedId };
}
