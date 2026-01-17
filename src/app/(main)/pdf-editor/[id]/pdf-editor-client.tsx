'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

import { CanvasArea } from '@/components/pdf-editor/canvas-area';
import { LeftPanel } from '@/components/pdf-editor/left-panel';
import { RightPanel } from '@/components/pdf-editor/right-panel';
import { Button } from '@/components/ui/button';
import {
  BuilderProvider,
  useBuilder,
  type BuilderElement,
  type DocumentSettings,
} from '@/contexts/builder-context';
import { useTRPCMutation, useTRPCQuery } from '@/server/react';

const DEBOUNCE_DELAY = 2000;

type PdfEditorClientProps = {
  pdfId: string;
  pdfName: string;
};

type PdfData = {
  pages?: Array<{ elements?: BuilderElement[] }>;
  documentSettings?: Partial<DocumentSettings>;
};

const PdfEditorInner = ({ pdfId, pdfName }: { pdfId: string; pdfName: string }) => {
  const { pages, documentSettings, setElements, updateDocumentSettings } = useBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: downloadUrlData, isLoading: isLoadingUrl } = useTRPCQuery((trpc) =>
    trpc.pdfs.getDownloadUrl.queryOptions({ id: pdfId }),
  );

  const uploadUrlMutation = useTRPCMutation((trpc) => trpc.pdfs.getUploadUrl.mutationOptions());

  const loadPdfData = useCallback(async () => {
    if (downloadUrlData?.downloadUrl === undefined) {
      setIsInitialized(true);
      return;
    }

    try {
      const response = await fetch(downloadUrlData.downloadUrl);
      if (!response.ok) {
        setIsInitialized(true);
        return;
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json') ?? false;
      if (!isJson) {
        setIsInitialized(true);
        return;
      }

      const data = (await response.json()) as PdfData;
      const hasPages =
        data.pages !== undefined && Array.isArray(data.pages) && data.pages.length > 0;
      if (hasPages) {
        const firstPageElements = data.pages?.[0]?.elements;
        if (firstPageElements !== undefined) {
          setElements(firstPageElements);
        }
      }
      if (data.documentSettings !== undefined) {
        updateDocumentSettings(data.documentSettings);
      }
    } catch {
      // File doesn't exist yet, start with empty state
    } finally {
      setIsInitialized(true);
    }
  }, [downloadUrlData?.downloadUrl, setElements, updateDocumentSettings]);

  useEffect(() => {
    if (!isLoadingUrl && !isInitialized) {
      void loadPdfData();
    }
  }, [isLoadingUrl, isInitialized, loadPdfData]);

  const savePdfData = useCallback(async () => {
    setIsSaving(true);
    try {
      const { uploadUrl } = await uploadUrlMutation.mutateAsync({ id: pdfId });

      const pdfData = JSON.stringify({ pages, documentSettings });

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: pdfData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save PDF');
      }

      setLastSaved(new Date());
    } catch (error) {
      toast.error('Failed to save PDF');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [pdfId, pages, documentSettings, uploadUrlMutation]);

  const debouncedSave = useDebouncedCallback(() => {
    void savePdfData();
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    if (isInitialized) {
      debouncedSave();
    }
  }, [pages, documentSettings, isInitialized, debouncedSave]);

  if (!isInitialized) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full w-full flex-1 flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/pdf-editor">
              <ArrowLeft className="mr-2 size-4" />
              {pdfName}
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          {lastSaved !== null && (
            <span className="text-muted-foreground text-sm">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isSaving === true && <span className="text-muted-foreground text-sm">Saving...</span>}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <CanvasArea />
        <RightPanel />
      </div>
    </div>
  );
};

export const PdfEditorClient = ({ pdfId, pdfName }: PdfEditorClientProps) => {
  return (
    <BuilderProvider>
      <PdfEditorInner pdfId={pdfId} pdfName={pdfName} />
    </BuilderProvider>
  );
};
