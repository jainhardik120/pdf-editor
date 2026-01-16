import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string(),
  thumbnailImageS3Path: z.array(z.string()),
  pdfFileS3Path: z.array(z.string()).min(1),
});

export const createFolderSchema = z.object({
  name: z.string().min(1),
});
