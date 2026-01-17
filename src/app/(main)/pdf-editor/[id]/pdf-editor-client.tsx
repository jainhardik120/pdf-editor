'use client';

import { useCallback, useEffect, useEffectEvent, useState } from 'react';

import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

import { CanvasArea } from '@/components/pdf-editor/canvas-area';
import { LeftPanel } from '@/components/pdf-editor/left-panel';
import { RightPanel } from '@/components/pdf-editor/right-panel';
import {
  BuilderProvider,
  useBuilder,
  type BuilderElement,
  type DocumentSettings,
  type PlaceholderValues,
} from '@/contexts/builder-context';
import { type HeaderState, useHeaderTextStore } from '@/hooks/use-header-store';
import { useTRPCMutation, useTRPCQuery } from '@/server/react';

const DEBOUNCE_DELAY = 2000;

type PdfEditorClientProps = {
  pdfId: string;
  pdfName: string;
};

type PdfData = {
  pages?: Array<{ elements?: BuilderElement[] }>;
  documentSettings?: Partial<DocumentSettings>;
  placeholderValues?: PlaceholderValues;
};

const PdfEditorInner = ({ pdfId, pdfName }: { pdfId: string; pdfName: string }) => {
  const {
    pages,
    documentSettings,
    placeholderValues,
    setElements,
    updateDocumentSettings,
    setPlaceholderValues,
  } = useBuilder();
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
      if (data.placeholderValues !== undefined) {
        setPlaceholderValues(data.placeholderValues);
      }
    } catch {
      // File doesn't exist yet, start with empty state
    } finally {
      setIsInitialized(true);
    }
  }, [downloadUrlData?.downloadUrl, setElements, updateDocumentSettings, setPlaceholderValues]);

  useEffect(() => {
    if (!isLoadingUrl && !isInitialized) {
      void loadPdfData();
    }
  }, [isLoadingUrl, isInitialized, loadPdfData]);

  const savePdfData = useCallback(async () => {
    setIsSaving(true);
    try {
      const { uploadUrl } = await uploadUrlMutation.mutateAsync({ id: pdfId });

      const pdfData = JSON.stringify({ pages, documentSettings, placeholderValues });

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
  }, [pdfId, pages, documentSettings, placeholderValues, uploadUrlMutation]);

  const debouncedSave = useDebouncedCallback(() => {
    void savePdfData();
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    if (isInitialized) {
      debouncedSave();
    }
  }, [pages, documentSettings, placeholderValues, isInitialized, debouncedSave]);

  const { setText, ...headerState } = useHeaderTextStore();

  const setHeaderState = useEffectEvent((val: Partial<HeaderState>) => {
    setText({ ...headerState, ...val });
  });

  useEffect(() => {
    let secondaryText: string = '';
    if (isSaving === true) {
      secondaryText = 'Saving...';
    } else if (lastSaved !== null) {
      secondaryText = `Last saved: ${lastSaved.toLocaleTimeString()}`;
    }
    setHeaderState({
      primaryText: pdfName,
      backNavigation: '/pdf-editor',
      secondaryText,
    });
  }, [pdfName, isSaving, lastSaved]);

  if (!isInitialized) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className="bg-background flex h-full w-full flex-1 flex-col">
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
