ALTER TABLE `user` MODIFY COLUMN `emailVerified` timestamp;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `emailVerified` timestamp DEFAULT null;