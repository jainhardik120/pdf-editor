'use client';

import { useMemo, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useBuilder,
  JUSTIFY_CONTENT_OPTIONS,
  ALIGN_ITEMS_OPTIONS,
  DIVIDER_STYLE_OPTIONS,
  LIST_TYPE_OPTIONS,
} from '@/contexts/builder-context';

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
  | 'color'
  | 'borderColor'
  | 'cellPadding'
  | 'headerBackground'
  | 'style'
  | 'listType';

interface PropertyConfig {
  key: PropertyKey;
  label: string;
  type: 'text' | 'color' | 'select';
  options?: readonly string[];
}

const BACKGROUND_COLOR_LABEL = 'Background Color';

const getPropertiesForType = (elementType: string): PropertyConfig[] => {
  const typeSpecific: Record<string, PropertyConfig[]> = {
    row: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' },
      {
        key: 'justifyContent',
        label: 'Justify Content',
        type: 'select',
        options: JUSTIFY_CONTENT_OPTIONS,
      },
      { key: 'alignItems', label: 'Align Items', type: 'select', options: ALIGN_ITEMS_OPTIONS },
      { key: 'backgroundColor', label: BACKGROUND_COLOR_LABEL, type: 'color' },
    ],
    column: [
      { key: 'gap', label: 'Gap', type: 'text' },
      { key: 'padding', label: 'Padding', type: 'text' },
      {
        key: 'justifyContent',
        label: 'Justify Content',
        type: 'select',
        options: JUSTIFY_CONTENT_OPTIONS,
      },
      { key: 'alignItems', label: 'Align Items', type: 'select', options: ALIGN_ITEMS_OPTIONS },
      { key: 'backgroundColor', label: BACKGROUND_COLOR_LABEL, type: 'color' },
    ],
    text: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'fontSize', label: 'Font Size', type: 'text' },
      { key: 'color', label: 'Color', type: 'color' },
    ],
    image: [
      { key: 'width', label: 'Width', type: 'text' },
      { key: 'height', label: 'Height', type: 'text' },
      { key: 'backgroundColor', label: BACKGROUND_COLOR_LABEL, type: 'color' },
    ],
    button: [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'backgroundColor', label: BACKGROUND_COLOR_LABEL, type: 'color' },
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'color', label: 'Text Color', type: 'color' },
      { key: 'margin', label: 'Margin', type: 'text' },
    ],
    spacer: [{ key: 'height', label: 'Height', type: 'text' }],
    divider: [
      { key: 'height', label: 'Thickness', type: 'text' },
      { key: 'color', label: 'Color', type: 'color' },
      { key: 'style', label: 'Style', type: 'select', options: DIVIDER_STYLE_OPTIONS },
    ],
    table: [
      { key: 'borderColor', label: 'Border Color', type: 'color' },
      { key: 'cellPadding', label: 'Cell Padding', type: 'text' },
      { key: 'headerBackground', label: 'Header Background', type: 'color' },
    ],
    list: [
      { key: 'listType', label: 'List Type', type: 'select', options: LIST_TYPE_OPTIONS },
      { key: 'fontSize', label: 'Font Size', type: 'text' },
      { key: 'color', label: 'Color', type: 'color' },
    ],
  };

  return (
    typeSpecific[elementType] ?? [
      { key: 'text', label: 'Text', type: 'text' },
      { key: 'backgroundColor', label: BACKGROUND_COLOR_LABEL, type: 'color' },
      { key: 'padding', label: 'Padding', type: 'text' },
      { key: 'margin', label: 'Margin', type: 'text' },
      { key: 'color', label: 'Color', type: 'color' },
    ]
  );
};

interface TextPropertyFieldProps {
  propertyKey: PropertyKey;
  label: string;
  value: string;
  onChange: (key: PropertyKey, value: string) => void;
}

const TextPropertyField = ({ propertyKey, label, value, onChange }: TextPropertyFieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    <Input
      className="h-8 text-xs"
      placeholder={label}
      type="text"
      value={value}
      onChange={(e) => {
        onChange(propertyKey, e.target.value);
      }}
    />
  </div>
);

interface ColorPropertyFieldProps {
  propertyKey: PropertyKey;
  label: string;
  value: string;
  onChange: (key: PropertyKey, value: string) => void;
}

const ColorPropertyField = ({ propertyKey, label, value, onChange }: ColorPropertyFieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    <div className="flex gap-2">
      <input
        aria-label={`${label} color picker`}
        className="border-border h-8 w-12 cursor-pointer rounded border"
        type="color"
        value={value !== '' ? value : '#000000'}
        onChange={(e) => {
          onChange(propertyKey, e.target.value);
        }}
      />
      <Input
        className="h-8 flex-1 text-xs"
        placeholder={label}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(propertyKey, e.target.value);
        }}
      />
    </div>
  </div>
);

interface SelectPropertyFieldProps {
  propertyKey: PropertyKey;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (key: PropertyKey, value: string) => void;
}

const SelectPropertyField = ({
  propertyKey,
  label,
  value,
  options,
  onChange,
}: SelectPropertyFieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    <Select
      value={value}
      onValueChange={(newValue) => {
        onChange(propertyKey, newValue);
      }}
    >
      <SelectTrigger className="h-8 w-full text-xs">
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

interface QuickColorsProps {
  onColorSelect: (color: string) => void;
  disabled: boolean;
}

const QUICK_COLORS = [
  { name: 'Purple', color: '#7c3aed' },
  { name: 'Black', color: '#1a1a1a' },
  { name: 'White', color: '#ffffff' },
  { name: 'Gray', color: '#666666' },
] as const;

const QuickColors = ({ onColorSelect, disabled }: QuickColorsProps) => (
  <div className="border-border space-y-2 border-t p-2">
    <p className="text-muted-foreground mb-1 text-xs font-medium">Quick Colors</p>
    <div className="grid grid-cols-4 gap-1">
      {QUICK_COLORS.map(({ name, color }) => (
        <Button
          key={name}
          aria-label={`Set background color to ${name}`}
          className="h-7 p-0"
          disabled={disabled}
          size="sm"
          style={{ backgroundColor: color }}
          title={name}
          onClick={() => {
            onColorSelect(color);
          }}
        />
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="bg-card border-border flex h-full w-64 flex-col border-l">
    <div className="border-border h-12 border-b px-3 py-2">
      <h2 className="text-foreground text-xs font-semibold">Properties</h2>
    </div>
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted-foreground text-center text-xs">Select an element to edit</p>
    </div>
  </div>
);

export const RightPanel = () => {
  const { selectedId, getSelectedElement, updateElement } = useBuilder();
  const element = getSelectedElement();

  const handlePropertyChange = useCallback(
    (key: PropertyKey, value: string) => {
      if (selectedId === null || element === null) {
        return;
      }
      updateElement(selectedId, {
        props: {
          ...element.props,
          [key]: value,
        },
      });
    },
    [selectedId, element, updateElement],
  );

  const properties = useMemo(() => {
    if (element === null) {
      return [];
    }
    return getPropertiesForType(element.type);
  }, [element]);

  const hasBackgroundColorProperty = useMemo(
    () => properties.some((p) => p.key === 'backgroundColor'),
    [properties],
  );

  if (element === null) {
    return <EmptyState />;
  }

  return (
    <div className="bg-card border-border flex h-full w-64 flex-col border-l">
      <div className="border-border h-12 border-b px-3 py-2">
        <h2 className="text-foreground text-xs font-semibold">Properties</h2>
        <p className="text-muted-foreground mt-0.5 text-xs capitalize">{element.type}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {properties.map((property) => {
            const value = (element.props[property.key] as string | undefined) ?? '';

            if (property.type === 'color') {
              return (
                <ColorPropertyField
                  key={property.key}
                  label={property.label}
                  propertyKey={property.key}
                  value={value}
                  onChange={handlePropertyChange}
                />
              );
            }

            if (property.type === 'select' && property.options !== undefined) {
              return (
                <SelectPropertyField
                  key={property.key}
                  label={property.label}
                  options={property.options}
                  propertyKey={property.key}
                  value={value}
                  onChange={handlePropertyChange}
                />
              );
            }

            return (
              <TextPropertyField
                key={property.key}
                label={property.label}
                propertyKey={property.key}
                value={value}
                onChange={handlePropertyChange}
              />
            );
          })}
        </div>
      </ScrollArea>

      <QuickColors
        disabled={!hasBackgroundColorProperty}
        onColorSelect={(color) => {
          handlePropertyChange('backgroundColor', color);
        }}
      />
    </div>
  );
};
