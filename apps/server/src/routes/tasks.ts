import { Hono } from "hono";
import { type HonoAppContext } from "../auth";
import { withAuth } from "../middlewares/auth.middleware";
import { db, task } from "../db";
import { err, ok } from "../utils/response";
import { and, eq } from "drizzle-orm";

export const taskRoute = new Hono<HonoAppContext<"IsAuthenticated">>()
  .use("*", withAuth)
  .get("/", async (c) => {
    try {
      const rows = await db.select().from(task);
      return ok(rows);
    } catch {
      return err("Something went wrong!", 500);
    }
  })
  .post("/", async (c) => {
    try {
      const session = c.get("session");
      if (!session) return err("Unauthorized", 401);
      const { title } = await c.req.json();
      const userid = session.userId;
      const id = crypto.randomUUID();

      await db.insert(task).values({
        id,
        userid,
        title,
        completed: false,
      });

      return ok({
        id,
        title,
        completed: false,
      });
    } catch {
      return err("Something went wrong!", 500);
    }
  })
  .patch("/", async (c) => {
    try {
      const session = c.get("session");
      if (!session) return err("Unauthorized : Please Login", 401);
      const { id } = await c.req.json();
      const userid = session.userId;

      const [currentTask] = await db
        .select({
          id: task.id,
          completed: task.completed,
        })
        .from(task)
        .where(and(eq(task.id, id), eq(task.userid, userid)));

      if (!currentTask) return err("Task not found", 404);

      await db
        .update(task)
        .set({ completed: !currentTask.completed })
        .where(and(eq(task.id, id), eq(task.userid, userid)));

      return ok({ message: "Task updated successfully" });
    } catch {
      return err("Something went wrong!", 500);
    }
  })
  .delete("/", async (c) => {
    try {
      const session = c.get("session");
      if (!session) return err("Unauthorized : Please Login", 401);
      const userid = session.userId;
      const { id } = await c.req.json();
      const [currentTask] = await db
        .select({
          id: task.id,
          completed: task.completed,
        })
        .from(task)
        .where(and(eq(task.id, id), eq(task.userid, userid)));
      if (!currentTask) return err("Task not found", 404);

      await db
        .delete(task)
        .where(and(eq(task.id, id), eq(task.userid, userid)));
      return ok({ message: "Task deleted" });
    } catch {
      return err("Something went wrong", 500);
    }
  });
