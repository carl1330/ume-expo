import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const volumeProgress = sqliteTable(
  "volume_progress",
  {
    volumeUuid: text("volume_uuid").primaryKey(),
    mangaId: text("manga_id").notNull(),
    lastPage: integer("last_page").notNull().default(0),
    totalPages: integer("total_pages").notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [index("volume_progress_manga_idx").on(t.mangaId)],
);

export type VolumeProgress = typeof volumeProgress.$inferSelect;
export type NewVolumeProgress = typeof volumeProgress.$inferInsert;
