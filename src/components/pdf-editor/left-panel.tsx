'use client';

import { useCallback, type DragEvent, type KeyboardEvent } from 'react';

import { type Props, useBuilder, type ElementType } from '@/contexts/builder-context';

interface ComponentTemplate {
  type: ElementType;
  label: string;
  icon: string;
  defaultProps: Props;
  category: 'layout' | 'content' | 'data';
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // Layout components
  {
    type: 'row',
    label: 'Row',
    icon: '─',
    defaultProps: { gap: '8px', padding: '8px', backgroundColor: 'transparent' },
    category: 'layout',
  },
  {
    type: 'column',
    label: 'Column',
    icon: '│',
    defaultProps: { gap: '8px', padding: '8px', backgroundColor: 'transparent' },
    category: 'layout',
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: '⬇',
    defaultProps: { height: '16px' },
    category: 'layout',
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '―',
    defaultProps: { height: '1px', color: '#e5e5e5', style: 'solid' },
    category: 'layout',
  },
  // Content components
  {
    type: 'text',
    label: 'Text',
    icon: 'A',
    defaultProps: { text: 'Edit text here', fontSize: '16px', color: 'inherit' },
    category: 'content',
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼',
    defaultProps: { width: '200px', height: '150px', backgroundColor: '#2a2a2a' },
    category: 'content',
  },
  {
    type: 'button',
    label: 'Button',
    icon: '⬜',
    defaultProps: {
      text: 'Click me',
      backgroundColor: '#7c3aed',
      padding: '8px 16px',
      color: '#ffffff',
    },
    category: 'content',
  },
  {
    type: 'list',
    label: 'List',
    icon: '•',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      listType: 'unordered',
      fontSize: '14px',
      color: 'inherit',
    },
    category: 'content',
  },
  // Data components
  {
    type: 'table',
    label: 'Table',
    icon: '▦',
    defaultProps: {
      rows: 3,
      columns: 3,
      borderColor: '#e5e5e5',
      cellPadding: '8px',
      headerBackground: '#f5f5f5',
      data: [
        ['Header 1', 'Header 2', 'Header 3'],
        ['Cell 1', 'Cell 2', 'Cell 3'],
        ['Cell 4', 'Cell 5', 'Cell 6'],
      ],
    },
    category: 'data',
  },
];

interface ComponentItemProps {
  template: ComponentTemplate;
  onDragStart: (e: DragEvent, template: ComponentTemplate) => void;
  onClick: (template: ComponentTemplate) => void;
}

const ComponentItem = ({ template, onDragStart, onClick }: ComponentItemProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(template);
    }
  };

  return (
    <div
      aria-label={`Add ${template.label} component`}
      className="bg-muted border-border hover:border-accent/50 active:bg-muted/80 group cursor-grab rounded border p-2 transition-all duration-200 active:cursor-grabbing"
      draggable
      role="button"
      tabIndex={0}
      onClick={() => {
        onClick(template);
      }}
      onDragStart={(e) => {
        onDragStart(e, template);
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-base">
          {template.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-xs font-semibold">{template.label}</p>
          <p className="text-muted-foreground text-xs">Drag or click</p>
        </div>
      </div>
    </div>
  );
};

interface CategorySectionProps {
  title: string;
  templates: ComponentTemplate[];
  onDragStart: (e: DragEvent, template: ComponentTemplate) => void;
  onClick: (template: ComponentTemplate) => void;
}

const CategorySection = ({ title, templates, onDragStart, onClick }: CategorySectionProps) => (
  <div className="space-y-1.5">
    <p className="text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase">
      {title}
    </p>
    {templates.map((template) => (
      <ComponentItem
        key={template.type}
        template={template}
        onClick={onClick}
        onDragStart={onDragStart}
      />
    ))}
  </div>
);

export const LeftPanel = () => {
  const { addElement } = useBuilder();

  const handleDragStart = useCallback((e: DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('component-type', template.type);
    e.dataTransfer.setData('component-props', JSON.stringify(template.defaultProps));
  }, []);

  const createNewElement = useCallback(
    (template: ComponentTemplate) => {
      const element = {
        id: `${template.type}-${Date.now()}`,
        type: template.type,
        children: [],
        props: template.defaultProps,
      };
      addElement(element);
    },
    [addElement],
  );

  const layoutTemplates = COMPONENT_TEMPLATES.filter((t) => t.category === 'layout');
  const contentTemplates = COMPONENT_TEMPLATES.filter((t) => t.category === 'content');
  const dataTemplates = COMPONENT_TEMPLATES.filter((t) => t.category === 'data');

  return (
    <div className="bg-card border-border flex h-full w-56 flex-col border-r">
      <div className="border-border h-12 border-b px-3 py-2">
        <h2 className="text-foreground text-xs font-semibold">Components</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">Drag or click to add</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-2">
        <CategorySection
          templates={layoutTemplates}
          title="Layout"
          onClick={createNewElement}
          onDragStart={handleDragStart}
        />
        <CategorySection
          templates={contentTemplates}
          title="Content"
          onClick={createNewElement}
          onDragStart={handleDragStart}
        />
        <CategorySection
          templates={dataTemplates}
          title="Data"
          onClick={createNewElement}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
};
