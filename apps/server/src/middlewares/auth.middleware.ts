import { createMiddleware } from "hono/factory";

import { HTTPException } from "hono/http-exception";
import type { HonoAppContext } from "../auth.ts";
import { err } from "../utils/response.js";

export const withAuth = createMiddleware<HonoAppContext<"IsAuthenticated">>(
  async (c, next) => {
    try {
      const user = c.get("user");

      if (!user) {
        err("Unauthorized , Please Login", 500);
      }

      await next();
    } catch {
      err("Something went wrong!")
    }
  }
);

export const withoutAuth = createMiddleware<
  HonoAppContext<"IsNotAuthenticated">
>(async (c, next) => {
  try {

    const user = c.get("user");

    if (user) {
      err("Only non-authenticated users can access this route");
    }

    await next();
  } catch {
    err("Something went wrong!")
  }
});
