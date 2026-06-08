import { Directory, File } from "expo-file-system";
import type { MokuroFile } from "../model/types";
import { parseMokuroFile } from "./parse-mokuro";

export async function readMokuroFile(
  dir: Directory,
): Promise<MokuroFile | null> {
  const entries = dir.list();
  const files = entries.filter((e): e is File => e instanceof File);
  const subdirs = entries.filter((e): e is Directory => e instanceof Directory);

  const rootMokuro = files.find((f) => f.name.endsWith(".mokuro"));
  if (rootMokuro) {
    const result = parseMokuroFile(await rootMokuro.text());
    if (result) return result;
  }

  for (const subdir of subdirs) {
    const subFiles = subdir.list().filter((e): e is File => e instanceof File);
    const mokuro = subFiles.find((f) => f.name.endsWith(".mokuro"));
    if (mokuro) {
      const result = parseMokuroFile(await mokuro.text());
      if (result) return result;
    }
  }

  return null;
}
