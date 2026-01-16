'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBuilder } from '@/contexts/builder-context';

type PropertyKey =
  | 'text'
  | 'width'
  | 'height'
  | 'backgroundColor'
  | 'padding'
  | 'fontSize'
  | 'gap'
  | 'margin'
  | 'justifyContent'
  | 'alignItems'
  | 'color';

export const RightPanel: React.FC = () => {
  const { selectedId, getSelectedElement, updateElement } = useBuilder();
  const element = getSelectedElement();

  if (element === null) {
    return (
      <div className="bg-card border-border flex h-full w-64 flex-col border-l">
        <div className="border-border h-12 border-b px-2 py-1.5">
          <h2 className="text-foreground text-xs font-bold">PROPERTIES</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground text-center text-xs">Select element to edit</p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (key: PropertyKey, value: string) => {
    if (selectedId === null) {
      return;
    }
    updateElement(selectedId, {
      props: {
        ...element.props,
        [key]: value,
      },
    });
  };

  const getRelevantProperties = () => {
    const common = ['text', 'backgroundColor', 'padding', 'margin', 'color'];
    const typeSpecific: Partial<Record<string, string[]>> = {
      row: ['gap', 'padding', 'justifyContent', 'alignItems', 'backgroundColor'],
      column: ['gap', 'padding', 'justifyContent', 'alignItems', 'backgroundColor'],
      text: ['text', 'fontSize', 'color'],
      image: ['width', 'height', 'backgroundColor'],
      button: ['text', 'backgroundColor', 'padding', 'color', 'margin'],
      spacer: ['height'],
    };
    return typeSpecific[element.type] ?? common;
  };

  const relevantProperties = getRelevantProperties();

  return (
    <div className="bg-card border-border flex h-full w-64 flex-col border-l">
      <div className="border-border h-12 border-b px-2 py-1.5">
        <h2 className="text-foreground text-xs font-bold">PROPERTIES</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">{element.type.toUpperCase()}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-2">
          {relevantProperties.map((key) => {
            const value = element.props[key] ?? '';

            if (key === 'backgroundColor' || key === 'color') {
              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs font-bold uppercase">{key}</Label>
                  <div className="flex gap-2">
                    <input
                      className="border-border h-8 w-12 cursor-pointer rounded border"
                      type="color"
                      value={value !== '' ? value : '#000000'}
                      onChange={(e) => {
                        handlePropertyChange(key as PropertyKey, e.target.value);
                      }}
                    />
                    <Input
                      className="h-8 flex-1 text-xs"
                      placeholder={key}
                      type="text"
                      value={value}
                      onChange={(e) => {
                        handlePropertyChange(key as PropertyKey, e.target.value);
                      }}
                    />
                  </div>
                </div>
              );
            }

            if (key === 'justifyContent' || key === 'alignItems') {
              const options =
                key === 'justifyContent'
                  ? ['flex-start', 'center', 'flex-end', 'space-between', 'space-around']
                  : ['flex-start', 'center', 'flex-end', 'stretch'];

              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs font-bold uppercase">{key}</Label>
                  <select
                    className="border-border bg-background text-foreground h-8 w-full rounded border px-2 text-xs"
                    value={value}
                    onChange={(e) => {
                      handlePropertyChange(key as PropertyKey, e.target.value);
                    }}
                  >
                    <option value="">Select...</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={key} className="space-y-1">
                <Label className="text-xs font-bold uppercase">{key}</Label>
                <Input
                  className="h-8 text-xs"
                  placeholder={key}
                  type="text"
                  value={value}
                  onChange={(e) => {
                    handlePropertyChange(key as PropertyKey, e.target.value);
                  }}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-border space-y-2 border-t p-2">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-bold uppercase">Quick Colors</p>
          <div className="grid grid-cols-4 gap-1">
            {[
              { name: 'Purple', color: '#7c3aed' },
              { name: 'Black', color: '#1a1a1a' },
              { name: 'White', color: '#ffffff' },
              { name: 'Gray', color: '#666666' },
            ].map(({ name, color }) => (
              <Button
                key={name}
                className="h-7 p-0"
                size="sm"
                style={{ backgroundColor: color }}
                title={name}
                onClick={() => {
                  if (relevantProperties.includes('backgroundColor')) {
                    handlePropertyChange('backgroundColor', color);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
