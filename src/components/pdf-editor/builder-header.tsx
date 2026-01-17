'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBuilder } from '@/contexts/builder-context';

import { PreviewDialog } from './preview-dialog';

export const CanvasHeader: React.FC = () => {
  const { exportJSON, resetElements } = useBuilder();
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all elements.')) {
      resetElements();
    }
  };

  const jsonContent = exportJSON();

  return (
    <>
      <div className="border-border bg-card flex h-12 items-center justify-between border-b px-2 py-1.5">
        <div>
          <h2 className="text-foreground text-xs font-bold">CANVAS</h2>
          <p className="text-muted-foreground mt-0.5 text-xs">Drop components here</p>
        </div>
        <div className="flex items-center gap-2">
          <PreviewDialog />
          <Button
            size="sm"
            onClick={() => {
              setShowExportDialog(true);
            }}
          >
            Export
          </Button>

          <Button size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>Export your design as JSON or view the structure</DialogDescription>
          </DialogHeader>
          <pre className="bg-muted border-border max-h-80 overflow-auto rounded border p-3 text-xs">
            <code>{jsonContent}</code>
          </pre>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(jsonContent);
                alert('Copied to clipboard!');
              }}
            >
              Copy JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const element = document.createElement('a');
                element.setAttribute(
                  'href',
                  `data:text/plain;charset=utf-8,${encodeURIComponent(jsonContent)}`,
                );
                element.setAttribute('download', 'builder-export.json');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
