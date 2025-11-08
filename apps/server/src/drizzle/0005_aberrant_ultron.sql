CREATE TABLE `task` (
	`id` varchar(36) NOT NULL,
	`userid` varchar(36) NOT NULL,
	`title` text NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `task_id` PRIMARY KEY(`id`)
);
