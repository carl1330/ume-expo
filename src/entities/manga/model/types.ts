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
  title: string;
};

export type VolumeDir = Directory;
export type VolumePage = File;

export type MangaWithPagination = {
  manga: Manga[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
};

export type TopMangaQuery = JikanOperations["getTopManga"]["parameters"]["query"];
export type MangaSearchQuery = JikanOperations["getMangaSearch"]["parameters"]["query"];
export type MangaQuery = JikanOperations["getMangaById"]["parameters"]["path"];
