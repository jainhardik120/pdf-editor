'use client';

import { useState, useCallback, useMemo } from 'react';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBuilder, type PlaceholderValues } from '@/contexts/builder-context';

export const PreviewDialog = () => {
  const { getPlaceholders, placeholderValues, setPlaceholderValues } = useBuilder();
  const [isOpen, setIsOpen] = useState(false);

  const placeholders = getPlaceholders();

  const initialValues = useMemo(() => {
    const values: PlaceholderValues = {};
    for (const placeholder of placeholders) {
      values[placeholder] = placeholderValues[placeholder] ?? '';
    }
    return values;
  }, [placeholders, placeholderValues]);

  const [localValues, setLocalValues] = useState<PlaceholderValues>(initialValues);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        const values: PlaceholderValues = {};
        for (const placeholder of placeholders) {
          values[placeholder] = placeholderValues[placeholder] ?? '';
        }
        setLocalValues(values);
      }
      setIsOpen(open);
    },
    [placeholders, placeholderValues],
  );

  const handleValueChange = useCallback((key: string, value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApply = useCallback(() => {
    setPlaceholderValues(localValues);
    setIsOpen(false);
  }, [localValues, setPlaceholderValues]);

  const handleClear = useCallback(() => {
    const cleared: PlaceholderValues = {};
    for (const placeholder of placeholders) {
      cleared[placeholder] = '';
    }
    setLocalValues(cleared);
  }, [placeholders]);

  if (placeholders.length === 0) {
    return (
      <Button disabled size="sm" title="No placeholders in document" variant="outline">
        <Eye className="mr-2 size-4" />
        Preview
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="mr-2 size-4" />
          Preview ({placeholders.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Preview with Values</DialogTitle>
          <DialogDescription>
            Enter values for placeholders to preview how your PDF will look with real data.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4 pr-4">
            {placeholders.map((placeholder) => (
              <div key={placeholder} className="space-y-1.5">
                <Label className="text-xs font-medium" htmlFor={`placeholder-${placeholder}`}>
                  {`{{${placeholder}}}`}
                </Label>
                <Input
                  className="h-8 text-xs"
                  id={`placeholder-${placeholder}`}
                  placeholder={`Enter value for ${placeholder}`}
                  value={localValues[placeholder] ?? ''}
                  onChange={(e) => {
                    handleValueChange(placeholder, e.target.value);
                  }}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button size="sm" variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply Values
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
