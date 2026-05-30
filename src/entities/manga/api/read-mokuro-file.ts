import { Directory, File } from "expo-file-system";
import type { MokuroFile } from "../model/types";

export async function readMokuroFile(dir: Directory): Promise<MokuroFile | null> {
  const entries = dir.list();
  const files = entries.filter((e): e is File => e instanceof File);
  const subdirs = entries.filter((e): e is Directory => e instanceof Directory);

  // Check root level first (single-volume layout: .mokuro alongside images)
  const rootMokuro = files.find((f) => f.name.endsWith(".mokuro"));
  if (rootMokuro) {
    const result = await parseMokuroFile(rootMokuro);
    if (result) return result;
  }

  // Check one level deep (multi-volume layout: .mokuro inside each volume subdir)
  for (const subdir of subdirs) {
    const subFiles = subdir.list().filter((e): e is File => e instanceof File);
    const mokuro = subFiles.find((f) => f.name.endsWith(".mokuro"));
    if (mokuro) {
      const result = await parseMokuroFile(mokuro);
      if (result) return result;
    }
  }

  return null;
}

async function parseMokuroFile(file: File): Promise<MokuroFile | null> {
  try {
    const json = JSON.parse(await file.text());
    if (typeof json.title_uuid === "string" && typeof json.title === "string") {
      return { title_uuid: json.title_uuid, title: json.title };
    }
    return null;
  } catch {
    return null;
  }
}
