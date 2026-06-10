CREATE TABLE `volume_progress` (
	`volume_uuid` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`last_page` integer DEFAULT 0 NOT NULL,
	`total_pages` integer NOT NULL,
	`completed_at` integer,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `volume_progress_manga_idx` ON `volume_progress` (`manga_id`);