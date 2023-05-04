/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { env } from "~/env.mjs";
import type { ErrorType } from "~/interfaces/Error";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// const isDevEnv = process.env.NODE_ENV === "development";
export const rightMoveRouter = createTRPCRouter({
  addNew: protectedProcedure
    .input(
      z.object({
        input: z
          .string()
          .url()
          .refine((val) => {
            if (!val.includes("https://www.rightmove.co.uk")) {
              throw new Error("Must be a right move url");
            }
            return true;
          }),
      })
    )
    .mutation(async ({ ctx, input: { input } }) => {
      try {
        const res = await fetch(
          `${env.CLOUD_FUNCTIONS_URL}/checkProperty?url=${input}`
        );

        if (res.status > 200) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Cloud function failed.",
          });
        }

        const data: {
          property: {
            title: string;
            image?: string;
            price: number;
            media: string[];
          };
        } = await res.json();

        const newProperty = await ctx.prisma.property.create({
          data: {
            name: data.property.title || "Default Tittle",
            price: data.property.price,
            url: input,
            ...(data?.property?.media?.length && {
              media: data?.property?.media,
            }),
            ...(data.property.image && { image: data.property.image }),
          },
        });

        return newProperty;
      } catch (e) {
        console.log("🚀  addNew Error", e);
        const error = e as ErrorType;
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Property already exists",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something Went wrong",
        });
      }
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        sort: z.enum(["default", "price"]),
      })
    )
    .query(async ({ ctx, input: { sort } }) => {
      const properties = await ctx.prisma.property.findMany({
        where: {
          archived: false,
        },
        include: {
          PropertyUpdates: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: [
          { sold: "asc" },
          {
            ...(sort === "default" && { createdAt: "desc" }),
            ...(sort === "price" && { price: "asc" }),
          },
        ],
      });
      return properties;
    }),
  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        const updatedProperty = await ctx.prisma.property.update({
          where: {
            id,
          },
          data: {
            archived: true,
          },
        });
        return updatedProperty;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something Went wrong",
          cause: e,
        });
      }
    }),
});
