import { Manga } from "@/shared/api/manga/models";

export type MangaWithPagination = {
  manga: Manga[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
  };
};
