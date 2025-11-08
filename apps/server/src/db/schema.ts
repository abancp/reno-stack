import {
    mysqlTable,
    varchar,
    text,
    timestamp,
    boolean,
} from "drizzle-orm/mysql-core";

export const task = mysqlTable("task", {
    id: varchar("id", { length: 36 }).primaryKey(),
    userid: varchar("userid", { length: 36 }).notNull(),
    title: text("title").notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
})
