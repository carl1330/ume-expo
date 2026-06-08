import { Directory, File } from "expo-file-system";
import type { PageContent, VolumeContent } from "../model/types";
import { readMokuroFile } from "./read-mokuro-file";

export async function getVolumeContent(dir: Directory): Promise<VolumeContent> {
  const mokuro = await readMokuroFile(dir);
  if (!mokuro) {
    throw new Error(`No .mokuro file found in volume "${dir.name}"`);
  }

  const pages: PageContent[] = mokuro.pages.map((page) => {
    const segments = page.img_path.split("/").filter(Boolean);
    return {
      uri: new File(dir, ...segments).uri,
      width: page.img_width,
      height: page.img_height,
      blocks: page.blocks,
    };
  });

  return { name: dir.name, pages };
}
