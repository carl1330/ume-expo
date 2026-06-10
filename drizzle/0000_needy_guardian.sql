CREATE TABLE `manga` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`mal_id` integer,
	`score` real,
	`status` text,
	`synopsis` text,
	`authors` text DEFAULT '[]' NOT NULL,
	`cover_updated_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `manga_mal_id_idx` ON `manga` (`mal_id`);--> statement-breakpoint
CREATE TABLE `volume` (
	`uuid` text PRIMARY KEY NOT NULL,
	`manga_id` text NOT NULL,
	`dir_name` text NOT NULL,
	`total_pages` integer NOT NULL,
	`cover_path` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`manga_id`) REFERENCES `manga`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `volume_manga_idx` ON `volume` (`manga_id`);--> statement-breakpoint
CREATE TABLE `volume_progress` (
	`volume_uuid` text PRIMARY KEY NOT NULL,
	`last_page` integer DEFAULT 0 NOT NULL,
	`completed_at` integer,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`volume_uuid`) REFERENCES `volume`(`uuid`) ON UPDATE no action ON DELETE cascade
);
