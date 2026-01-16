/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { useRef } from 'react';

import {
  isElementType,
  type Props,
  PropsSchema,
  useBuilder,
  type BuilderElement,
} from '@/contexts/builder-context';

import { CanvasElement } from './canvas-element';

const dragClasses = ['ring-1', 'ring-accent/50'];

export const CanvasArea: React.FC = () => {
  const { elements, addElement, selectedId, selectElement } = useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (canvasRef.current !== null) {
      canvasRef.current.classList.add(...dragClasses);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      if (canvasRef.current) {
        canvasRef.current.classList.remove(...dragClasses);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (canvasRef.current !== null) {
      canvasRef.current.classList.remove(...dragClasses);
    }

    const componentType = e.dataTransfer.getData('component-type');
    if (isElementType(componentType)) {
      const propsStr = e.dataTransfer.getData('component-props');
      let defaultProps: Props = {};
      if (propsStr !== '') {
        const parseResult = PropsSchema.safeParse(JSON.parse(propsStr));
        if (parseResult.success) {
          defaultProps = parseResult.data;
        }
      }
      const newElement: BuilderElement = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        children: [],
        props: defaultProps,
      };
      addElement(newElement);
    }
  };

  return (
    <div className="bg-background flex flex-1 flex-col overflow-auto">
      <div className="border-border bg-card border-b px-2 py-1.5">
        <h2 className="text-foreground text-xs font-bold">CANVAS</h2>
        <p className="text-muted-foreground mt-0.5 text-xs">Drop components here</p>
      </div>

      <div
        ref={canvasRef}
        className="bg-background m-0 flex-1 cursor-pointer overflow-auto rounded-none border-none p-2 transition-colors hover:border-none"
        onClick={() => {
          selectElement(null);
        }}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {elements.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-1 text-xs font-medium">No elements yet</p>
              <p className="text-muted-foreground text-xs">Drag components from the left panel</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={element.id === selectedId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
