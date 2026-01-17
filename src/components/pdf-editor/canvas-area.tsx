'use client';

import { useRef, useCallback, type DragEvent, type KeyboardEvent } from 'react';

import {
  isElementType,
  type Props,
  PropsSchema,
  useBuilder,
  type BuilderElement,
} from '@/contexts/builder-context';

import { CanvasHeader } from './builder-header';
import { CanvasElement } from './canvas-element';
import { PageNavigation } from './page-navigation';

const DRAG_CLASSES = ['ring-1', 'ring-accent/50'];
const ELEMENT_ID_DATA_KEY = 'element-id';

const PAGE_HEIGHT = '1123px'; // A4 height at 96 DPI
const PAGE_WIDTH = '794px'; // A4 width at 96 DPI

export const CanvasArea = () => {
  const { elements, addElement, selectedId, selectElement, documentSettings, moveElementToRoot } =
    useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    const isMovingElement = e.dataTransfer.types.includes(ELEMENT_ID_DATA_KEY);
    const isNewComponent = e.dataTransfer.types.includes('component-type');

    if (isMovingElement || isNewComponent) {
      e.dataTransfer.dropEffect = isMovingElement ? 'move' : 'copy';
      if (canvasRef.current !== null) {
        canvasRef.current.classList.add(...DRAG_CLASSES);
      }
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      canvasRef.current?.classList.remove(...DRAG_CLASSES);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (canvasRef.current !== null) {
        canvasRef.current.classList.remove(...DRAG_CLASSES);
      }

      const elementId = e.dataTransfer.getData(ELEMENT_ID_DATA_KEY);
      if (typeof elementId === 'string' && elementId.length > 0) {
        moveElementToRoot(elementId);
        return;
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
    },
    [addElement, moveElementToRoot],
  );

  const handleCanvasClick = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        selectElement(null);
      }
    },
    [selectElement],
  );

  const renderHeaderElements = () => {
    if (documentSettings.header.length === 0) {
      return null;
    }
    return (
      <div className="border-border mb-2 border-b pb-2">
        {documentSettings.header.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedId}
          />
        ))}
      </div>
    );
  };

  const renderFooterElements = () => {
    if (documentSettings.footer.length === 0) {
      return null;
    }
    return (
      <div className="border-border mt-2 border-t pt-2">
        {documentSettings.footer.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedId}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-muted/30 flex flex-1 flex-col overflow-hidden">
      <CanvasHeader />
      <PageNavigation />

      <div className="flex flex-1 items-start justify-center overflow-auto p-8">
        <div
          ref={canvasRef}
          aria-label="Canvas drop zone"
          className="bg-background flex flex-col overflow-hidden rounded-sm shadow-lg transition-colors"
          role="listbox"
          style={{
            width: PAGE_WIDTH,
            minHeight: PAGE_HEIGHT,
            padding: `${documentSettings.margins.top} ${documentSettings.margins.right} ${documentSettings.margins.bottom} ${documentSettings.margins.left}`,
          }}
          tabIndex={0}
          onClick={handleCanvasClick}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
        >
          {renderHeaderElements()}

          <div className="flex-1">
            {elements.length === 0 ? (
              <div className="flex h-full min-h-32 items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-1 text-xs font-medium">No elements yet</p>
                  <p className="text-muted-foreground text-xs">
                    Drag components from the left panel
                  </p>
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

          {renderFooterElements()}
        </div>
      </div>
    </div>
  );
};
