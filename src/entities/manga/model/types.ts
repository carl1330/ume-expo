import type { Directory, File } from "expo-file-system";
import type { JikanOperations } from "@/shared/api";

export type Manga = {
  id: string;
  malId: number | null;
  title: string;
  coverUrl: string | null;
  score: number | null;
  status: string | null;
  authors: { id: number; name: string }[];
};

export type MokuroFile = {
  title_uuid: string;
  volume_uuid: string;
  title: string;
  pages: MokuroPage[];
};

export type MokuroPage = {
  version: string;
  img_width: number;
  img_height: number;
  img_path: string;
  blocks: MokuroBlock[];
};

export type MokuroBlock = {
  box: [number, number, number, number];
  vertical: boolean;
  font_size: number;
  lines_coords: [Line, Line, Line, Line][];
  lines: string[];
};

export type Line = [number, number];

export type VolumePage = File;

export type MangaWithPagination = {
  manga: Manga[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
};

export type Volume = {
  dir: Directory;
  cover: string | null;
};

export type VolumeMetadata = {
  cover: string | null;
};

export type MangaMetadataFile = Manga & {
  volumes?: Record<string, VolumeMetadata>;
};

export type TopMangaQuery =
  JikanOperations["getTopManga"]["parameters"]["query"];
export type MangaSearchQuery =
  JikanOperations["getMangaSearch"]["parameters"]["query"];
export type MangaQuery = JikanOperations["getMangaById"]["parameters"]["path"];
