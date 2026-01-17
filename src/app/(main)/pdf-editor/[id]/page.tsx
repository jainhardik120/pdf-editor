import { HydrateClient, fetchQuery, prefetch } from '@/server/server';

import { PdfEditorClient } from './pdf-editor-client';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const PdfEditorIdPage = async ({ params }: PageProps) => {
  const { id } = await params;

  prefetch((trpc) => trpc.pdfs.getById.queryOptions({ id }));
  prefetch((trpc) => trpc.pdfs.getDownloadUrl.queryOptions({ id }));

  const pdfData = await fetchQuery((trpc) => trpc.pdfs.getById.queryOptions({ id }));

  return (
    <HydrateClient>
      <PdfEditorClient pdfId={id} pdfName={pdfData.name} />
    </HydrateClient>
  );
};

export default PdfEditorIdPage;
