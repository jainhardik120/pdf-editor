import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { z } from 'zod';

import { env } from '@/lib/env';

import { createTRPCRouter, protectedProcedure } from '../trpc';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const filesRouter = createTRPCRouter({
  getSignedUrlForUploadingFiles: protectedProcedure
    .input(
      z.array(
        z.object({
          filename: z.string(),
          contentType: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const uploadUrls = await Promise.all(
        input.map(async (file) => {
          const key = `${ctx.session.user.id}/${new Date().getTime()}-${file.filename}`;
          const command = new PutObjectCommand({
            Bucket: env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: file.contentType,
          });
          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          return {
            fileName: file.filename,
            uploadUrl: presignedUrl,
            key,
          };
        }),
      );
      const map = new Map<string, { key: string; uploadUrl: string }>();
      uploadUrls.forEach((uploadUrl) => {
        map.set(uploadUrl.fileName, {
          key: uploadUrl.key,
          uploadUrl: uploadUrl.uploadUrl,
        });
      });
      return map;
    }),
});
