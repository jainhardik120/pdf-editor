'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';

import Papa from 'papaparse';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  useBuilder,
  JUSTIFY_CONTENT_OPTIONS,
  ALIGN_ITEMS_OPTIONS,
  DIVIDER_STYLE_OPTIONS,
  LIST_TYPE_OPTIONS,
  type BuilderElement,
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
  | 'listType'
  | 'src'
  | 'alt'
  | 'items'
  | 'data';

interface PropertyConfig {
  key: PropertyKey;
  label: string;
  type: 'text' | 'color' | 'select' | 'textarea' | 'csv' | 'list';
  options?: readonly string[];
  placeholder?: string;
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
      {
        key: 'text',
        label: 'Text',
        type: 'textarea',
        placeholder: 'Enter text. Use {{name}} for placeholders',
      },
      { key: 'fontSize', label: 'Font Size', type: 'text' },
      { key: 'color', label: 'Color', type: 'color' },
    ],
    image: [
      {
        key: 'src',
        label: 'Image URL',
        type: 'text',
        placeholder: 'https://example.com/image.png or {{imageUrl}}',
      },
      { key: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Image description' },
      { key: 'width', label: 'Width', type: 'text' },
      { key: 'height', label: 'Height', type: 'text' },
      { key: 'backgroundColor', label: BACKGROUND_COLOR_LABEL, type: 'color' },
    ],
    button: [
      {
        key: 'text',
        label: 'Text',
        type: 'text',
        placeholder: 'Button text. Use {{name}} for placeholders',
      },
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
      {
        key: 'data',
        label: 'Table Data (CSV)',
        type: 'csv',
        placeholder: 'Header 1,Header 2,Header 3\nCell 1,Cell 2,Cell 3',
      },
      { key: 'borderColor', label: 'Border Color', type: 'color' },
      { key: 'cellPadding', label: 'Cell Padding', type: 'text' },
      { key: 'headerBackground', label: 'Header Background', type: 'color' },
    ],
    list: [
      {
        key: 'items',
        label: 'List Items',
        type: 'list',
        placeholder: 'Item 1\nItem 2\nItem 3',
      },
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
  placeholder?: string;
  onChange: (key: PropertyKey, value: string) => void;
}

const TextPropertyField = ({
  propertyKey,
  label,
  value,
  placeholder,
  onChange,
}: TextPropertyFieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    <Input
      className="h-8 text-xs"
      placeholder={placeholder ?? label}
      type="text"
      value={value}
      onChange={(e) => {
        onChange(propertyKey, e.target.value);
      }}
    />
  </div>
);

interface TextareaPropertyFieldProps {
  propertyKey: PropertyKey;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (key: PropertyKey, value: string) => void;
}

const TextareaPropertyField = ({
  propertyKey,
  label,
  value,
  placeholder,
  onChange,
}: TextareaPropertyFieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    <Textarea
      className="min-h-[60px] text-xs"
      placeholder={placeholder ?? label}
      value={value}
      onChange={(e) => {
        onChange(propertyKey, e.target.value);
      }}
    />
  </div>
);

interface CsvPropertyFieldProps {
  propertyKey: PropertyKey;
  label: string;
  value: string[][];
  placeholder?: string;
  onChange: (key: PropertyKey, value: string[][]) => void;
}

const CsvPropertyField = ({
  propertyKey,
  label,
  value,
  placeholder,
  onChange,
}: CsvPropertyFieldProps) => {
  const csvString = useMemo(() => {
    if (!Array.isArray(value) || value.length === 0) {
      return '';
    }
    return value.map((row) => row.join(',')).join('\n');
  }, [value]);

  const [localCsv, setLocalCsv] = useState(csvString);

  useEffect(() => {
    setLocalCsv(csvString);
  }, [csvString]);

  const handleCsvChange = useCallback(
    (text: string) => {
      setLocalCsv(text);
      const result = Papa.parse<string[]>(text, {
        skipEmptyLines: true,
      });
      if (result.data.length > 0) {
        onChange(propertyKey, result.data);
      }
    },
    [propertyKey, onChange],
  );

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Textarea
        className="min-h-[80px] font-mono text-xs"
        placeholder={placeholder ?? 'Header1,Header2\nCell1,Cell2'}
        value={localCsv}
        onChange={(e) => {
          handleCsvChange(e.target.value);
        }}
      />
      <p className="text-muted-foreground text-xs">Enter comma-separated values</p>
    </div>
  );
};

interface ListPropertyFieldProps {
  propertyKey: PropertyKey;
  label: string;
  value: string[];
  placeholder?: string;
  onChange: (key: PropertyKey, value: string[]) => void;
}

const ListPropertyField = ({
  propertyKey,
  label,
  value,
  placeholder,
  onChange,
}: ListPropertyFieldProps) => {
  const listString = useMemo(() => {
    if (!Array.isArray(value)) {
      return '';
    }
    return value.join('\n');
  }, [value]);

  const [localList, setLocalList] = useState(listString);

  useEffect(() => {
    setLocalList(listString);
  }, [listString]);

  const handleListChange = useCallback(
    (text: string) => {
      setLocalList(text);
      const items = text.split('\n').filter((item) => item.trim() !== '');
      onChange(propertyKey, items);
    },
    [propertyKey, onChange],
  );

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Textarea
        className="min-h-[60px] text-xs"
        placeholder={placeholder ?? 'Item 1\nItem 2\nItem 3'}
        value={localList}
        onChange={(e) => {
          handleListChange(e.target.value);
        }}
      />
      <p className="text-muted-foreground text-xs">One item per line</p>
    </div>
  );
};

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
  <div className="flex flex-1 items-center justify-center">
    <p className="text-muted-foreground text-center text-xs">Select an element to edit</p>
  </div>
);

interface ElementPropertiesPanelProps {
  element: BuilderElement | null;
  selectedId: string | null;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
}

const ElementPropertiesPanel = ({
  element,
  selectedId,
  updateElement,
}: ElementPropertiesPanelProps) => {
  const handlePropertyChange = useCallback(
    (key: PropertyKey, value: string | string[] | string[][]) => {
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
    <div className="flex flex-1 flex-col">
      <div className="border-border border-b px-3 py-2">
        <p className="text-muted-foreground text-xs capitalize">{element.type}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {properties.map((property) => {
            if (property.type === 'color') {
              const value = (element.props[property.key] as string | undefined) ?? '';
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
              const value = (element.props[property.key] as string | undefined) ?? '';
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

            if (property.type === 'textarea') {
              const value = (element.props[property.key] as string | undefined) ?? '';
              return (
                <TextareaPropertyField
                  key={property.key}
                  label={property.label}
                  placeholder={property.placeholder}
                  propertyKey={property.key}
                  value={value}
                  onChange={handlePropertyChange}
                />
              );
            }

            if (property.type === 'csv') {
              const value = (element.props[property.key] as string[][] | undefined) ?? [];
              return (
                <CsvPropertyField
                  key={property.key}
                  label={property.label}
                  placeholder={property.placeholder}
                  propertyKey={property.key}
                  value={value}
                  onChange={handlePropertyChange}
                />
              );
            }

            if (property.type === 'list') {
              const value = (element.props[property.key] as string[] | undefined) ?? [];
              return (
                <ListPropertyField
                  key={property.key}
                  label={property.label}
                  placeholder={property.placeholder}
                  propertyKey={property.key}
                  value={value}
                  onChange={handlePropertyChange}
                />
              );
            }

            const value = (element.props[property.key] as string | undefined) ?? '';
            return (
              <TextPropertyField
                key={property.key}
                label={property.label}
                placeholder={property.placeholder}
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

const PAGE_SIZE_OPTIONS = ['A4', 'Letter', 'Legal'] as const;
const ORIENTATION_OPTIONS = ['portrait', 'landscape'] as const;

const DocumentSettingsPanel = () => {
  const { documentSettings, updateDocumentSettings } = useBuilder();

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Page Size</Label>
          <Select
            value={documentSettings.pageSize}
            onValueChange={(value: 'A4' | 'Letter' | 'Legal') => {
              updateDocumentSettings({ pageSize: value });
            }}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Orientation</Label>
          <Select
            value={documentSettings.orientation}
            onValueChange={(value: 'portrait' | 'landscape') => {
              updateDocumentSettings({ orientation: value });
            }}
          >
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORIENTATION_OPTIONS.map((orientation) => (
                <SelectItem key={orientation} value={orientation}>
                  {orientation.charAt(0).toUpperCase() + orientation.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Margins</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Top</Label>
              <Input
                className="h-8 text-xs"
                value={documentSettings.margins.top}
                onChange={(e) => {
                  updateDocumentSettings({
                    margins: { ...documentSettings.margins, top: e.target.value },
                  });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Right</Label>
              <Input
                className="h-8 text-xs"
                value={documentSettings.margins.right}
                onChange={(e) => {
                  updateDocumentSettings({
                    margins: { ...documentSettings.margins, right: e.target.value },
                  });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Bottom</Label>
              <Input
                className="h-8 text-xs"
                value={documentSettings.margins.bottom}
                onChange={(e) => {
                  updateDocumentSettings({
                    margins: { ...documentSettings.margins, bottom: e.target.value },
                  });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Left</Label>
              <Input
                className="h-8 text-xs"
                value={documentSettings.margins.left}
                onChange={(e) => {
                  updateDocumentSettings({
                    margins: { ...documentSettings.margins, left: e.target.value },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

interface HeaderFooterItemProps {
  element: BuilderElement;
  onRemove: (id: string) => void;
}

const HeaderFooterItem = ({ element, onRemove }: HeaderFooterItemProps) => (
  <div className="bg-muted border-border flex items-center justify-between rounded border p-2">
    <div>
      <p className="text-xs font-medium capitalize">{element.type}</p>
      {element.props.text !== undefined ? (
        <p className="text-muted-foreground max-w-[120px] truncate text-xs">{element.props.text}</p>
      ) : null}
    </div>
    <Button
      aria-label="Remove element"
      className="text-destructive h-6 w-6 p-0"
      size="sm"
      variant="ghost"
      onClick={() => {
        onRemove(element.id);
      }}
    >
      ×
    </Button>
  </div>
);

interface AddElementButtonsProps {
  onAddText: () => void;
  onAddImage: () => void;
}

const AddElementButtons = ({ onAddText, onAddImage }: AddElementButtonsProps) => (
  <div className="flex gap-2">
    <Button className="h-7 flex-1 text-xs" size="sm" variant="outline" onClick={onAddText}>
      + Text
    </Button>
    <Button className="h-7 flex-1 text-xs" size="sm" variant="outline" onClick={onAddImage}>
      + Image
    </Button>
  </div>
);

const HeaderFooterPanel = () => {
  const {
    documentSettings,
    addHeaderElement,
    addFooterElement,
    removeHeaderElement,
    removeFooterElement,
  } = useBuilder();

  const handleAddHeaderText = useCallback(() => {
    const element: BuilderElement = {
      id: `header-text-${crypto.randomUUID()}`,
      type: 'text',
      children: [],
      props: { text: 'Header text', fontSize: '12px', color: 'inherit' },
    };
    addHeaderElement(element);
  }, [addHeaderElement]);

  const handleAddHeaderImage = useCallback(() => {
    const element: BuilderElement = {
      id: `header-image-${crypto.randomUUID()}`,
      type: 'image',
      children: [],
      props: { width: '100px', height: '40px', backgroundColor: '#2a2a2a' },
    };
    addHeaderElement(element);
  }, [addHeaderElement]);

  const handleAddFooterText = useCallback(() => {
    const element: BuilderElement = {
      id: `footer-text-${crypto.randomUUID()}`,
      type: 'text',
      children: [],
      props: { text: 'Footer text', fontSize: '10px', color: '#666666' },
    };
    addFooterElement(element);
  }, [addFooterElement]);

  const handleAddFooterImage = useCallback(() => {
    const element: BuilderElement = {
      id: `footer-image-${crypto.randomUUID()}`,
      type: 'image',
      children: [],
      props: { width: '80px', height: '30px', backgroundColor: '#2a2a2a' },
    };
    addFooterElement(element);
  }, [addFooterElement]);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Header Elements</Label>
          <p className="text-muted-foreground text-xs">
            Elements that appear at the top of every page
          </p>
          <div className="space-y-1">
            {documentSettings.header.map((element) => (
              <HeaderFooterItem key={element.id} element={element} onRemove={removeHeaderElement} />
            ))}
          </div>
          <AddElementButtons onAddImage={handleAddHeaderImage} onAddText={handleAddHeaderText} />
        </div>

        <div className="border-border border-t pt-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Footer Elements</Label>
            <p className="text-muted-foreground text-xs">
              Elements that appear at the bottom of every page
            </p>
            <div className="space-y-1">
              {documentSettings.footer.map((element) => (
                <HeaderFooterItem
                  key={element.id}
                  element={element}
                  onRemove={removeFooterElement}
                />
              ))}
            </div>
            <AddElementButtons onAddImage={handleAddFooterImage} onAddText={handleAddFooterText} />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export const RightPanel = () => {
  const { selectedId, getSelectedElement, updateElement } = useBuilder();
  const element = getSelectedElement();

  return (
    <div className="bg-card border-border flex h-full w-64 flex-col border-l">
      <Tabs className="flex flex-1 flex-col" defaultValue="properties">
        <TabsList className="border-border mx-2 mt-2 grid w-auto grid-cols-3">
          <TabsTrigger className="text-xs" value="properties">
            Element
          </TabsTrigger>
          <TabsTrigger className="text-xs" value="document">
            Document
          </TabsTrigger>
          <TabsTrigger className="text-xs" value="headerFooter">
            Header
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-0 flex flex-1 flex-col" value="properties">
          <ElementPropertiesPanel
            element={element}
            selectedId={selectedId}
            updateElement={updateElement}
          />
        </TabsContent>

        <TabsContent className="mt-0 flex flex-1 flex-col" value="document">
          <DocumentSettingsPanel />
        </TabsContent>

        <TabsContent className="mt-0 flex flex-1 flex-col" value="headerFooter">
          <HeaderFooterPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
