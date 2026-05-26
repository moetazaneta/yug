CREATE TABLE `entries` (
	`id` text PRIMARY KEY,
	`questionId` text NOT NULL,
	`value` text NOT NULL,
	`createdAt` text DEFAULT (current_timestamp),
	`updatedAt` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY,
	`icon` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`color` text NOT NULL,
	`valueType` text NOT NULL,
	`valueUnits` text NOT NULL,
	`repeat` text NOT NULL,
	`createdAt` text DEFAULT (current_timestamp),
	`updatedAt` text DEFAULT (current_timestamp)
);
