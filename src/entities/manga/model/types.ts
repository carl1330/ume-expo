import type { Directory } from "expo-file-system";
import type { JikanOperations } from "@/shared/api";

export type Manga = {
  id: string;
  malId: number | null;
  title: string;
  coverUrl: string | null;
  score: number | null;
  status: string | null;
  authors: { id: number; name: string }[];
  synopsis?: string | null;
};

export type MokuroFile = {
  title_uuid: string;
  volume_uuid: string;
  title: string;
  pages: MokuroPage[];
};

export type MokuroPage = {
  version?: string;
  img_width: number;
  img_height: number;
  img_path: string;
  blocks: MokuroBlock[];
};

export type MokuroBlock = {
  box: [number, number, number, number];
  vertical: boolean;
  font_size?: number;
  lines_coords?: [Line, Line, Line, Line][];
  lines: string[];
};

export type Line = [number, number];

export type MangaWithPagination = {
  manga: Manga[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
};

export type Volume = {
  dir: Directory;
  uuid: string;
  cover: string;
};

export type PageContent = {
  uri: string;
  width: number;
  height: number;
  blocks: MokuroBlock[];
};

export type VolumeContent = {
  name: string;
  pages: PageContent[];
};

export type TopMangaQuery =
  JikanOperations["getTopManga"]["parameters"]["query"];
export type MangaSearchQuery =
  JikanOperations["getMangaSearch"]["parameters"]["query"];
export type MangaQuery = JikanOperations["getMangaById"]["parameters"]["path"];
