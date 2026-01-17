import { createTRPCRouter } from '@/server/trpc';

import { filesRouter } from './files';
import { pdfsRouter } from './pdfs';

import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';

export const appRouter = createTRPCRouter({
  files: filesRouter,
  pdfs: pdfsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
