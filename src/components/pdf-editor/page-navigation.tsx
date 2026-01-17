'use client';

import { useCallback, useState, type KeyboardEvent } from 'react';

import { Plus, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBuilder } from '@/contexts/builder-context';

export const PageNavigation = () => {
  const { pages, currentPageId, selectPage, addPage, removePage, renamePage } = useBuilder();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const currentIndex = pages.findIndex((p) => p.id === (currentPageId ?? pages[0]?.id));

  const handlePrevPage = useCallback(() => {
    if (currentIndex > 0) {
      selectPage(pages[currentIndex - 1].id);
    }
  }, [currentIndex, pages, selectPage]);

  const handleNextPage = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      selectPage(pages[currentIndex + 1].id);
    }
  }, [currentIndex, pages, selectPage]);

  const handleStartEdit = useCallback((pageId: string, currentName: string) => {
    setEditingPageId(pageId);
    setEditName(currentName);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingPageId !== null && editName.trim() !== '') {
      renamePage(editingPageId, editName.trim());
    }
    setEditingPageId(null);
    setEditName('');
  }, [editingPageId, editName, renamePage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSaveEdit();
      }
      if (e.key === 'Escape') {
        setEditingPageId(null);
        setEditName('');
      }
    },
    [handleSaveEdit],
  );

  return (
    <div className="bg-card border-border flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <Button
          aria-label="Previous page"
          className="h-8 w-8 p-0"
          disabled={currentIndex <= 0}
          size="sm"
          variant="ghost"
          onClick={handlePrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page) => {
            const isActive = page.id === (currentPageId ?? pages[0]?.id);
            const isEditing = editingPageId === page.id;

            return (
              <div key={page.id} className="flex items-center">
                {isEditing ? (
                  <Input
                    className="h-7 w-24 text-xs"
                    value={editName}
                    onBlur={handleSaveEdit}
                    onChange={(e) => {
                      setEditName(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <Button
                    aria-label={`Go to ${page.name}`}
                    className={`h-7 px-3 text-xs ${isActive ? 'bg-accent' : ''}`}
                    size="sm"
                    variant={isActive ? 'secondary' : 'ghost'}
                    onClick={() => {
                      selectPage(page.id);
                    }}
                    onDoubleClick={() => {
                      handleStartEdit(page.id, page.name);
                    }}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    {page.name}
                  </Button>
                )}
                {pages.length > 1 && isActive ? (
                  <Button
                    aria-label={`Delete ${page.name}`}
                    className="text-destructive hover:text-destructive ml-1 h-6 w-6 p-0"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removePage(page.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>

        <Button
          aria-label="Next page"
          className="h-8 w-8 p-0"
          disabled={currentIndex >= pages.length - 1}
          size="sm"
          variant="ghost"
          onClick={handleNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">
          Page {currentIndex + 1} of {pages.length}
        </span>
        <Button
          aria-label="Add new page"
          className="h-7 px-2 text-xs"
          size="sm"
          variant="outline"
          onClick={addPage}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Page
        </Button>
      </div>
    </div>
  );
};
