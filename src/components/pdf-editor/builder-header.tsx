'use client';

import { useState } from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBuilder } from '@/contexts/builder-context';

export const BuilderHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { exportJSON, resetElements } = useBuilder();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showJSONView, setShowJSONView] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all elements.')) {
      resetElements();
    }
  };

  const jsonContent = exportJSON();

  return (
    <>
      <header className="bg-card border-border border-b px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent text-accent-foreground rounded px-2 py-1 text-xs font-bold">
              BUILDER
            </div>
            <h1 className="text-foreground text-sm font-bold">Website Constructor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="gap-2"
              size="sm"
              variant="outline"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              className="bg-accent hover:bg-accent/90"
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
      </header>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-h-96 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>Export your design as JSON or view the structure</DialogDescription>
          </DialogHeader>
          <Tabs
            value={showJSONView ? 'json' : 'code'}
            onValueChange={(v) => {
              setShowJSONView(v === 'json');
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Structure</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            <TabsContent className="mt-4" value="code">
              <pre className="bg-muted border-border max-h-80 overflow-auto rounded border p-3 text-xs">
                <code>{jsonContent}</code>
              </pre>
            </TabsContent>
            <TabsContent className="mt-4" value="json">
              <pre className="bg-muted border-border max-h-80 overflow-auto rounded border p-3 text-xs">
                <code>{jsonContent}</code>
              </pre>
            </TabsContent>
          </Tabs>
          <div className="mt-4 flex gap-2">
            <Button
              className="bg-accent hover:bg-accent/90"
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
