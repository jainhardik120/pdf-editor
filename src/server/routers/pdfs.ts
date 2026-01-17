import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TRPCError } from '@trpc/server';
import { and, count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { type db as dbType } from '@/db';
import { pdf } from '@/db/schema';
import { env } from '@/lib/env';

import { createTRPCRouter, protectedProcedure } from '../trpc';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const PRESIGNED_URL_EXPIRY = 3600;

const getPdfS3Key = (userId: string, pdfId: string) => `pdf-data/${userId}/${pdfId}.json`;

const MAX_PAGE_LIMIT = 100;
const DEFAULT_PAGE_LIMIT = 10;
const MAX_NAME_LENGTH = 255;

const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'Invalid UUID format',
  );

const validatePdfAccess = async (
  db: typeof dbType,
  pdfId: string,
  userId: string,
): Promise<void> => {
  const pdfRecord = await db
    .select({ id: pdf.id })
    .from(pdf)
    .where(and(eq(pdf.id, pdfId), eq(pdf.userId, userId)))
    .limit(1);

  if (pdfRecord.length === 0) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'PDF not found or access denied',
    });
  }
};

export const pdfsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(MAX_PAGE_LIMIT).default(DEFAULT_PAGE_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;
      const userId = ctx.session.user.id;

      const [pdfs, totalCount] = await Promise.all([
        ctx.db
          .select({
            id: pdf.id,
            name: pdf.name,
            createdAt: pdf.createdAt,
            updatedAt: pdf.updatedAt,
          })
          .from(pdf)
          .where(eq(pdf.userId, userId))
          .orderBy(desc(pdf.updatedAt))
          .limit(input.limit)
          .offset(offset),
        ctx.db
          .select({ count: count() })
          .from(pdf)
          .where(eq(pdf.userId, userId))
          .then((result) => result[0]?.count ?? 0),
      ]);

      return {
        pdfs,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / input.limit),
        },
      };
    }),

  getById: protectedProcedure.input(z.object({ id: uuidSchema })).query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const result = await ctx.db
      .select({
        id: pdf.id,
        name: pdf.name,
        createdAt: pdf.createdAt,
        updatedAt: pdf.updatedAt,
      })
      .from(pdf)
      .where(and(eq(pdf.id, input.id), eq(pdf.userId, userId)))
      .limit(1);
    if (result.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return result[0];
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(MAX_NAME_LENGTH),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await ctx.db
        .insert(pdf)
        .values({
          name: input.name,
          userId,
        })
        .returning({
          id: pdf.id,
          name: pdf.name,
        });

      return result[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: uuidSchema,
        name: z.string().min(1).max(MAX_NAME_LENGTH),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const result = await ctx.db
        .update(pdf)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(and(eq(pdf.id, input.id), eq(pdf.userId, userId)))
        .returning({
          id: pdf.id,
          name: pdf.name,
        });

      return result[0] ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db.delete(pdf).where(and(eq(pdf.id, input.id), eq(pdf.userId, userId)));

      return { success: true };
    }),

  getUploadUrl: protectedProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await validatePdfAccess(ctx.db, input.id, userId);

      const key = getPdfS3Key(userId, input.id);
      const command = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: 'application/json',
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: PRESIGNED_URL_EXPIRY,
      });

      await ctx.db.update(pdf).set({ updatedAt: new Date() }).where(eq(pdf.id, input.id));

      return { uploadUrl: presignedUrl, key };
    }),

  getDownloadUrl: protectedProcedure
    .input(z.object({ id: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await validatePdfAccess(ctx.db, input.id, userId);

      const key = getPdfS3Key(userId, input.id);
      const command = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: PRESIGNED_URL_EXPIRY,
      });

      return { downloadUrl: presignedUrl, key };
    }),
});
