import { TRPCError } from "@trpc/server";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { z } from "zod";
import type { ErrorType } from "~/interfaces/Error";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const isDevEnv = process.env.NODE_ENV === "development";

export const rightMoveRouter = createTRPCRouter({
  // getDetails: protectedProcedure
  //   .input(
  //     z.object({
  //       input: z
  //         .string()
  //         .url()
  //         .refine((val) => {
  //           if (!val.includes("https://www.rightmove.co.uk")) {
  //             throw new Error("Must be a right move url");
  //           }
  //           return true;
  //         }),
  //     })
  //   )
  //   .query(async ({ input: { input } }) => {
  //     const browser = await puppeteer.launch({ headless: "new" });
  //     const page = await browser.newPage();

  //     await page.goto(input);

  //     const divHandle = await page.$("._2uGNfP4v5SSYyfx3rZngKM");
  //     const imgHandle = !!divHandle && (await divHandle.$("img"));
  //     const imageUrl =
  //       !!imgHandle && (await imgHandle.evaluate((img) => img.src));

  //     const title = await page.$("._2uQQ3SV0eMHL1P6t5ZDo2q");
  //     const titleHandle =
  //       !!title && (await title.evaluate((title) => title.textContent));

  //     const price = await page.$("._1gfnqJ3Vtd1z40MlC0MzXu");
  //     const handlePrice = !!price && (await price.$("span"));
  //     const priceString =
  //       !!handlePrice &&
  //       (await handlePrice.evaluate((price) => price.textContent));

  //     // Close connection
  //     await browser.close();

  //     return {
  //       title: titleHandle as string,
  //       image: imageUrl as string,
  //       price: priceString as string,
  //     };
  //   }),
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
        const options = {
          ...(!isDevEnv && {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }),
        };

        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();

        await page.goto(input);

        const divHandle = await page.$("._2uGNfP4v5SSYyfx3rZngKM");
        if (!divHandle) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not find image",
          });
        }
        const imgHandle = await divHandle.$("img");
        const imageUrl = await imgHandle?.evaluate((img) => img.src);

        const title = await page.$("._2uQQ3SV0eMHL1P6t5ZDo2q");

        if (!title) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not find title",
          });
        }
        const titleHandle = await title.evaluate((title) => title.textContent);

        const price = await page.$("._1gfnqJ3Vtd1z40MlC0MzXu");
        if (!price) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Could not find price",
          });
        }
        const handlePrice = await price.$("span");
        const priceString =
          (await handlePrice?.evaluate((price) => price.textContent)) || "";
        const parsedPrice = parseInt(priceString.replace(/[^\d.-]/g, "")) || 0;

        // Close connection
        await browser.close();

        const newProperty = await ctx.prisma.property.create({
          data: {
            name: titleHandle || "Default Tittle",
            price: parsedPrice,
            url: input,
            ...(imageUrl && { image: imageUrl }),
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
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const properties = await ctx.prisma.property.findMany({
      where: {
        archived: false,
      },
      orderBy: [
        {
          sold: "asc",
        },
        {
          createdAt: "desc",
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
