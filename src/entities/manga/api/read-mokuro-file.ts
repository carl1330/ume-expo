import { Directory, File } from "expo-file-system";
import type { Line, MokuroBlock, MokuroFile, MokuroPage } from "../model/types";

export async function readMokuroFile(
  dir: Directory,
): Promise<MokuroFile | null> {
  const entries = dir.list();
  const files = entries.filter((e): e is File => e instanceof File);
  const subdirs = entries.filter((e): e is Directory => e instanceof Directory);

  const rootMokuro = files.find((f) => f.name.endsWith(".mokuro"));
  if (rootMokuro) {
    const result = await parseMokuroFile(rootMokuro);
    if (result) return result;
  }

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
    if (
      typeof json.title_uuid !== "string" ||
      typeof json.title !== "string" ||
      typeof json.volume_uuid !== "string" ||
      !Array.isArray(json.pages)
    ) {
      return null;
    }

    const pages: MokuroPage[] = [];
    for (const rawPage of json.pages) {
      const page = parsePage(rawPage);
      if (page) pages.push(page);
    }

    return {
      title_uuid: json.title_uuid,
      title: json.title,
      volume_uuid: json.volume_uuid,
      pages,
    };
  } catch {
    return null;
  }
}

function parsePage(raw: unknown): MokuroPage | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (
    typeof p.version !== "string" ||
    typeof p.img_width !== "number" ||
    typeof p.img_height !== "number" ||
    typeof p.img_path !== "string" ||
    !Array.isArray(p.blocks)
  ) {
    return null;
  }

  const blocks: MokuroBlock[] = [];
  for (const rawBlock of p.blocks) {
    const block = parseBlock(rawBlock);
    if (block) blocks.push(block);
  }

  return {
    version: p.version,
    img_width: p.img_width,
    img_height: p.img_height,
    img_path: p.img_path,
    blocks,
  };
}

function parseBlock(raw: unknown): MokuroBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (
    !isNumberTuple4(b.box) ||
    typeof b.vertical !== "boolean" ||
    typeof b.font_size !== "number" ||
    !Array.isArray(b.lines_coords) ||
    !Array.isArray(b.lines)
  ) {
    return null;
  }

  const linesCoords: [Line, Line, Line, Line][] = [];
  for (const quad of b.lines_coords) {
    const parsed = parseQuad(quad);
    if (parsed) linesCoords.push(parsed);
  }

  const lines: string[] = [];
  for (const line of b.lines) {
    if (typeof line === "string") lines.push(line);
  }

  return {
    box: b.box,
    vertical: b.vertical,
    font_size: b.font_size,
    lines_coords: linesCoords,
    lines,
  };
}

function parseQuad(raw: unknown): [Line, Line, Line, Line] | null {
  if (!Array.isArray(raw) || raw.length !== 4) return null;
  const out: Line[] = [];
  for (const pt of raw) {
    if (!isNumberTuple2(pt)) return null;
    out.push(pt);
  }
  return out as [Line, Line, Line, Line];
}

function isNumberTuple2(v: unknown): v is [number, number] {
  return (
    Array.isArray(v) &&
    v.length === 2 &&
    typeof v[0] === "number" &&
    typeof v[1] === "number"
  );
}

function isNumberTuple4(v: unknown): v is [number, number, number, number] {
  return (
    Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === "number")
  );
}
