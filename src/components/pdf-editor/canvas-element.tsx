/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
'use client';

import { useState } from 'react';

import { Trash2, Lock, LockOpen, ChevronUp, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  isElementType,
  type Props,
  PropsSchema,
  useBuilder,
  type BuilderElement,
} from '@/contexts/builder-context';

interface CanvasElementProps {
  element: BuilderElement;
  isSelected: boolean;
  parentId?: string;
  siblingIndex?: number;
  siblingsCount?: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  parentId,
  siblingIndex,
  siblingsCount,
}) => {
  const {
    selectElement,
    removeElement,
    addElement,
    updateElement,
    toggleLock,
    isAncestorLocked,
    moveElement,
  } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.props.text || '');
  const [isDragOverNestedArea, setIsDragOverNestedArea] = useState(false);

  const cannotMove = isAncestorLocked(element.id) || element.locked;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const handleTextEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text') {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleTextSave = () => {
    updateElement(element.id, {
      props: {
        ...element.props,
        text: editText,
      },
    });
    setIsEditing(false);
  };

  const handleMove = (direction: 'up' | 'down') => {
    if (parentId && siblingIndex !== undefined) {
      const newIndex = direction === 'up' ? siblingIndex - 1 : siblingIndex + 1;
      moveElement(siblingIndex, newIndex, parentId);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (cannotMove) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('element-id', element.id);
    e.dataTransfer.setData('element-data', JSON.stringify(element));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverNestedArea(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isMovingElement = e.dataTransfer.types.includes('element-id');
    const isNewComponent = e.dataTransfer.types.includes('component-type');

    if (element.type === 'row' || element.type === 'column') {
      if (isNewComponent || isMovingElement) {
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOverNestedArea(true);
      }
    } else if (isMovingElement) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      setIsDragOverNestedArea(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverNestedArea(false);

    const elementId = e.dataTransfer.getData('element-id');
    const componentType = e.dataTransfer.getData('component-type');

    if (elementId && (element.type === 'row' || element.type === 'column')) {
      // TODO: Implement moveElementToContainer in context
      return;
    }

    if (isElementType(componentType) && (element.type === 'row' || element.type === 'column')) {
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
      addElement(newElement, element.id);
    }
  };

  const renderElement = () => {
    const childrenToRender = element.children.map((child, idx) => (
      <CanvasElement
        key={child.id}
        element={child}
        isSelected={child.id === element.id}
        parentId={element.id}
        siblingIndex={idx}
        siblingsCount={element.children.length}
      />
    ));

    switch (element.type) {
      case 'row':
        return (
          <div
            className={`flex gap-2 rounded border p-2 transition-all ${
              isDragOverNestedArea ? 'ring-accent border-accent ring-2' : 'border-border'
            }`}
            style={{
              backgroundColor: element.props.backgroundColor || 'transparent',
              gap: element.props.gap || '8px',
              padding: element.props.padding || '8px',
              justifyContent: element.props.justifyContent || 'flex-start',
              alignItems: element.props.alignItems || 'stretch',
            }}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {element.children.length === 0 ? (
              <p className="text-muted-foreground py-4 text-xs">Row (empty)</p>
            ) : (
              childrenToRender
            )}
          </div>
        );
      case 'column':
        return (
          <div
            className={`flex flex-col gap-2 rounded border p-2 transition-all ${
              isDragOverNestedArea ? 'ring-accent border-accent ring-2' : 'border-border'
            }`}
            style={{
              backgroundColor: element.props.backgroundColor || 'transparent',
              gap: element.props.gap || '8px',
              padding: element.props.padding || '8px',
              justifyContent: element.props.justifyContent || 'flex-start',
              alignItems: element.props.alignItems || 'stretch',
            }}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {element.children.length === 0 ? (
              <p className="text-muted-foreground py-3 text-xs">Column (empty)</p>
            ) : (
              childrenToRender
            )}
          </div>
        );
      case 'text':
        return (
          <div className="py-1">
            {isEditing ? (
              <input
                autoFocus
                className="bg-input border-ring text-foreground w-full rounded border px-2 py-1 text-sm"
                style={{ fontSize: element.props.fontSize || '16px' }}
                value={editText}
                onBlur={handleTextSave}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTextSave();
                  }
                }}
              />
            ) : (
              <p
                className="text-foreground hover:bg-muted/50 cursor-text rounded px-2 py-1 transition-colors"
                style={{
                  fontSize: element.props.fontSize || '16px',
                  color: element.props.color || 'inherit',
                }}
                onClick={handleTextEdit}
              >
                {element.props.text || 'Click to edit'}
              </p>
            )}
          </div>
        );
      case 'image':
        return (
          <div
            className="border-border bg-muted flex items-center justify-center rounded border"
            style={{
              width: element.props.width || '200px',
              height: element.props.height || '150px',
              backgroundColor: element.props.backgroundColor || '#2a2a2a',
            }}
          >
            <p className="text-muted-foreground text-xs">Image</p>
          </div>
        );
      case 'button':
        return (
          <button
            className="rounded px-6 py-2 font-bold transition-all active:scale-95"
            style={{
              backgroundColor: element.props.backgroundColor || '#7c3aed',
              color: element.props.color || '#ffffff',
              padding: element.props.padding || '8px 16px',
              margin: element.props.margin || '0',
            }}
          >
            {element.props.text || 'Button'}
          </button>
        );
      case 'spacer':
        return <div style={{ height: element.props.height || '16px' }} />;
      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div
      className={`group relative transition-all ${isSelected ? 'active-ring' : ''} ${
        !cannotMove ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-60'
      }`}
      draggable={!cannotMove}
      onClick={handleClick}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      {renderElement()}

      {isSelected ? (
        <div className="bg-card border-border absolute -top-8 right-0 flex gap-1 rounded border p-1 opacity-0 transition-opacity group-hover:opacity-100">
          {parentId ? (
            <>
              <Button
                className="h-6 w-6 p-0"
                disabled={siblingIndex === 0 || cannotMove}
                size="sm"
                variant="ghost"
                onClick={() => {
                  handleMove('up');
                }}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                className="h-6 w-6 p-0"
                disabled={siblingIndex === (siblingsCount || 0) - 1 || cannotMove}
                size="sm"
                variant="ghost"
                onClick={() => {
                  handleMove('down');
                }}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </>
          ) : null}

          <Button
            className="h-6 w-6 p-0"
            size="sm"
            variant="ghost"
            onClick={() => {
              toggleLock(element.id);
            }}
          >
            {element.locked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
          </Button>

          <Button
            className="text-destructive hover:text-destructive h-6 w-6 p-0"
            size="sm"
            variant="ghost"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
