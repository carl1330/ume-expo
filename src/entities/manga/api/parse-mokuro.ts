import type { Line, MokuroBlock, MokuroFile, MokuroPage } from "../model/types";

export function parseMokuroFile(text: string): MokuroFile | null {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return null;
  }

  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  if (
    typeof j.title_uuid !== "string" ||
    typeof j.title !== "string" ||
    typeof j.volume_uuid !== "string" ||
    !Array.isArray(j.pages)
  ) {
    return null;
  }

  const pages: MokuroPage[] = [];
  for (const rawPage of j.pages) {
    const page = parsePage(rawPage);
    if (page) pages.push(page);
  }

  return {
    title_uuid: j.title_uuid,
    title: j.title,
    volume_uuid: j.volume_uuid,
    pages,
  };
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
