/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import type React from 'react';

import { type Props, useBuilder, type ElementType } from '@/contexts/builder-context';

interface ComponentTemplate {
  type: ElementType;
  label: string;
  icon: string;
  defaultProps: Props;
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    type: 'row',
    label: 'Row',
    icon: '─',
    defaultProps: { gap: '8px', padding: '8px', backgroundColor: 'transparent' },
  },
  {
    type: 'column',
    label: 'Column',
    icon: '│',
    defaultProps: { gap: '8px', padding: '8px', backgroundColor: 'transparent' },
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'A',
    defaultProps: { text: 'Edit text here', fontSize: '16px', color: 'inherit' },
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼',
    defaultProps: { width: '200px', height: '150px', backgroundColor: '#2a2a2a' },
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
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: '⬇',
    defaultProps: { height: '16px' },
  },
];

export const LeftPanel: React.FC = () => {
  const { addElement } = useBuilder();

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('component-type', template.type);
    e.dataTransfer.setData('component-props', JSON.stringify(template.defaultProps));
  };

  const createNewElement = (template: ComponentTemplate) => {
    const element = {
      // eslint-disable-next-line react-hooks/purity
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      children: [],
      props: template.defaultProps,
    };
    addElement(element);
  };

  return (
    <div className="bg-card border-border flex h-full w-56 flex-col border-r">
      <div className="border-border border-b px-2 py-1.5">
        <h2 className="text-foreground text-xs font-bold">COMPONENTS</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">Drag or click</p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-1.5">
        {COMPONENT_TEMPLATES.map((template) => (
          <div
            key={template.type}
            className="bg-muted border-border hover:border-accent/50 active:bg-muted/80 group cursor-grab rounded border p-2 transition-all active:cursor-grabbing"
            draggable
            onClick={() => {
              createNewElement(template);
            }}
            onDragStart={(e) => {
              handleDragStart(e, template);
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{template.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-xs font-bold">{template.label}</p>
                <p className="text-muted-foreground text-xs">Drag or click</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
