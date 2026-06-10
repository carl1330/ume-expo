import { db } from "@/shared/lib";
import { manga, volume, volumeProgress } from "@db/schema";
import type { MokuroFile } from "../model/types";

type Params = {
  mangaId: string;
  mokuro: MokuroFile;
  dirName: string;
};

export async function saveImportedVolume({
  mangaId,
  mokuro,
  dirName,
}: Params): Promise<void> {
  const coverPath = mokuro.pages[0]?.img_path ?? "";

  await db.transaction(async (tx) => {
    await tx
      .insert(manga)
      .values({
        id: mangaId,
        title: mokuro.title,
        authors: "[]",
      })
      .onConflictDoNothing();

    await tx
      .insert(volume)
      .values({
        uuid: mokuro.volume_uuid,
        mangaId,
        dirName,
        totalPages: mokuro.pages.length,
        coverPath,
      })
      .onConflictDoNothing();

    await tx
      .insert(volumeProgress)
      .values({
        volumeUuid: mokuro.volume_uuid,
        lastPage: 0,
      })
      .onConflictDoNothing();
  });
}
