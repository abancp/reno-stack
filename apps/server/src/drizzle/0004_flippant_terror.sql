ALTER TABLE `user` MODIFY COLUMN `emailVerified` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `emailVerified` boolean NOT NULL DEFAULT false;