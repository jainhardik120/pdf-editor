import { Suspense } from 'react';

import { createSearchParamsCache, parseAsInteger } from 'nuqs/server';

import { HydrateClient, prefetch } from '@/server/server';

import { PdfListTable } from './pdf-list-table';

const DEFAULT_LIMIT = 10;

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
});

type PageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
};

const PdfEditorPage = async ({ searchParams }: PageProps) => {
  const { page, limit } = await searchParamsCache.parse(searchParams);

  prefetch((trpc) => trpc.pdfs.list.queryOptions({ page, limit }));

  return (
    <HydrateClient>
      <div className="container mx-auto py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <PdfListTable initialLimit={limit} initialPage={page} />
        </Suspense>
      </div>
    </HydrateClient>
  );
};

export default PdfEditorPage;
