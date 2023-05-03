import { createTRPCRouter } from "~/server/api/trpc";
import { rightMoveRouter } from "~/server/api/routers/rightMove";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rightMove: rightMoveRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
