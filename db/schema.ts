import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const manga = sqliteTable(
  "manga",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    malId: integer("mal_id"),
    score: real("score"),
    status: text("status"),
    synopsis: text("synopsis"),
    authors: text("authors").notNull().default("[]"),
    coverUpdatedAt: integer("cover_updated_at"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("manga_mal_id_idx").on(t.malId)],
);

export const volume = sqliteTable(
  "volume",
  {
    uuid: text("uuid").primaryKey(),
    mangaId: text("manga_id")
      .notNull()
      .references(() => manga.id, { onDelete: "cascade" }),
    dirName: text("dir_name").notNull(),
    totalPages: integer("total_pages").notNull(),
    coverPath: text("cover_path").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("volume_manga_idx").on(t.mangaId)],
);

export const volumeProgress = sqliteTable("volume_progress", {
  volumeUuid: text("volume_uuid")
    .primaryKey()
    .references(() => volume.uuid, { onDelete: "cascade" }),
  lastPage: integer("last_page").notNull().default(0),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type MangaRow = typeof manga.$inferSelect;
export type NewMangaRow = typeof manga.$inferInsert;
export type VolumeRow = typeof volume.$inferSelect;
export type NewVolumeRow = typeof volume.$inferInsert;
export type VolumeProgress = typeof volumeProgress.$inferSelect;
export type NewVolumeProgress = typeof volumeProgress.$inferInsert;
