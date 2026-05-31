CREATE TABLE IF NOT EXISTS `entries` (
	`id` text PRIMARY KEY,
	`questionId` text NOT NULL,
	`value` text NOT NULL,
	`datetime` text DEFAULT (current_timestamp) NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `questions` (
	`id` text PRIMARY KEY,
	`icon` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`color` text NOT NULL,
	`valueType` text NOT NULL,
	`valueUnits` text DEFAULT '' NOT NULL,
	`repeat` text DEFAULT 'daily' NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` text DEFAULT (current_timestamp) NOT NULL
);
