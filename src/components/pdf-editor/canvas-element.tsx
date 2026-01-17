'use client';

import { useState, useCallback, type KeyboardEvent, type DragEvent, type MouseEvent } from 'react';

import { Trash2, Lock, LockOpen, ChevronUp, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  isElementType,
  type Props,
  PropsSchema,
  useBuilder,
  type BuilderElement,
} from '@/contexts/builder-context';

const ELEMENT_ID_DATA_KEY = 'element-id';

interface CanvasElementProps {
  element: BuilderElement;
  isSelected: boolean;
  parentId?: string;
  siblingIndex?: number;
  siblingsCount?: number;
}

interface ChildrenRendererProps {
  element: BuilderElement;
  selectedId: string | null;
}

const ChildrenRenderer = ({ element, selectedId }: ChildrenRendererProps) => (
  <>
    {element.children.map((child, idx) => (
      <CanvasElement
        key={child.id}
        element={child}
        isSelected={child.id === selectedId}
        parentId={element.id}
        siblingIndex={idx}
        siblingsCount={element.children.length}
      />
    ))}
  </>
);

interface ContainerElementProps {
  element: BuilderElement;
  selectedId: string | null;
  isDragOver: boolean;
  isRow: boolean;
  onDragLeave: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}

const ContainerElement = ({
  element,
  selectedId,
  isDragOver,
  isRow,
  onDragLeave,
  onDragOver,
  onDrop,
}: ContainerElementProps) => (
  <div
    aria-label={isRow ? 'Row container' : 'Column container'}
    className={`flex gap-2 rounded border p-2 transition-all duration-200 ${
      isRow ? '' : 'flex-col'
    } ${isDragOver ? 'border-accent ring-accent ring-2' : 'border-border'}`}
    role="listbox"
    style={{
      backgroundColor: element.props.backgroundColor ?? 'transparent',
      gap: element.props.gap ?? '8px',
      padding: element.props.padding ?? '8px',
      justifyContent: element.props.justifyContent ?? 'flex-start',
      alignItems: element.props.alignItems ?? 'stretch',
    }}
    tabIndex={0}
    onDragLeave={onDragLeave}
    onDragOver={onDragOver}
    onDrop={onDrop}
  >
    {element.children.length === 0 ? (
      <p className="text-muted-foreground py-4 text-xs">{isRow ? 'Row' : 'Column'} (empty)</p>
    ) : (
      <ChildrenRenderer element={element} selectedId={selectedId} />
    )}
  </div>
);

interface TextElementProps {
  element: BuilderElement;
  isEditing: boolean;
  editText: string;
  displayText: string;
  onTextChange: (value: string) => void;
  onTextSave: () => void;
  onStartEdit: () => void;
}

const TextElement = ({
  element,
  isEditing,
  editText,
  displayText,
  onTextChange,
  onTextSave,
  onStartEdit,
}: TextElementProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onTextSave();
    }
  };

  if (isEditing) {
    return (
      <div className="py-1">
        <input
          className="bg-input border-ring text-foreground w-full rounded border px-2 py-1 text-sm"
          style={{ fontSize: element.props.fontSize ?? '16px' }}
          value={editText}
          onBlur={onTextSave}
          onChange={(e) => {
            onTextChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  return (
    <div className="py-1">
      <button
        className="text-foreground hover:bg-muted/50 w-full cursor-text rounded px-2 py-1 text-left transition-colors"
        style={{
          fontSize: element.props.fontSize ?? '16px',
          color: element.props.color ?? 'inherit',
        }}
        type="button"
        onClick={onStartEdit}
      >
        {displayText}
      </button>
    </div>
  );
};

interface ImageElementProps {
  element: BuilderElement;
  resolvePlaceholder: (text: string) => string;
}

const ImageElement = ({ element, resolvePlaceholder }: ImageElementProps) => {
  const src = element.props.src !== undefined ? resolvePlaceholder(element.props.src) : '';
  const alt = element.props.alt !== undefined ? resolvePlaceholder(element.props.alt) : 'Image';
  const hasValidSrc = src !== '' && !src.startsWith('{{');
  const [hasError, setHasError] = useState(false);

  const getPlaceholderText = (): string => {
    if (hasError) {
      return 'Image failed to load';
    }
    if (src !== '') {
      return src;
    }
    return 'Set image URL in properties';
  };

  return (
    <div
      className="border-border bg-muted flex items-center justify-center overflow-hidden rounded border"
      style={{
        width: element.props.width ?? '200px',
        height: element.props.height ?? '150px',
        backgroundColor: element.props.backgroundColor ?? '#2a2a2a',
      }}
    >
      {hasValidSrc && !hasError ? (
        /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={alt}
          className="h-full w-full object-cover"
          src={src}
          onError={() => {
            setHasError(true);
          }}
        />
      ) : (
        <p className="text-muted-foreground text-xs">{getPlaceholderText()}</p>
      )}
    </div>
  );
};

interface ButtonElementProps {
  element: BuilderElement;
  displayText: string;
}

const ButtonElement = ({ element, displayText }: ButtonElementProps) => (
  <div
    className="rounded px-6 py-2 text-center font-bold"
    style={{
      backgroundColor: element.props.backgroundColor ?? '#7c3aed',
      color: element.props.color ?? '#ffffff',
      padding: element.props.padding ?? '8px 16px',
      margin: element.props.margin ?? '0',
    }}
  >
    {displayText}
  </div>
);

interface SpacerElementProps {
  element: BuilderElement;
}

const SpacerElement = ({ element }: SpacerElementProps) => (
  <div
    className="bg-muted/30 border-border border border-dashed"
    style={{ height: element.props.height ?? '16px' }}
  />
);

interface DividerElementProps {
  element: BuilderElement;
}

const DividerElement = ({ element }: DividerElementProps) => (
  <hr
    className="w-full"
    style={{
      height: element.props.height ?? '1px',
      backgroundColor: element.props.color ?? '#e5e5e5',
      border: 'none',
      borderStyle: (element.props.style as string | undefined) ?? 'solid',
    }}
  />
);

interface TableElementProps {
  element: BuilderElement;
  resolvePlaceholder: (text: string) => string;
}

/* eslint-disable react/no-array-index-key */
const TableElement = ({ element, resolvePlaceholder }: TableElementProps) => {
  const data = (element.props.data as string[][] | undefined) ?? [
    ['Header 1', 'Header 2', 'Header 3'],
    ['Cell 1', 'Cell 2', 'Cell 3'],
  ];
  const cellPadding = (element.props.cellPadding as string | undefined) ?? '8px';
  const borderColor = (element.props.borderColor as string | undefined) ?? '#e5e5e5';
  const headerBackground = (element.props.headerBackground as string | undefined) ?? '#f5f5f5';

  return (
    <table className="w-full border-collapse" style={{ borderColor }}>
      <thead>
        {data.length > 0 ? (
          <tr>
            {data[0].map((cell, idx) => (
              <th
                key={`header-${element.id}-${idx}`}
                className="border text-left text-sm font-semibold"
                style={{
                  padding: cellPadding,
                  borderColor,
                  backgroundColor: headerBackground,
                }}
              >
                {resolvePlaceholder(cell)}
              </th>
            ))}
          </tr>
        ) : null}
      </thead>
      <tbody>
        {data.slice(1).map((row, rowIdx) => (
          <tr key={`row-${element.id}-${rowIdx}`}>
            {row.map((cell, cellIdx) => (
              <td
                key={`cell-${element.id}-${rowIdx}-${cellIdx}`}
                className="border text-sm"
                style={{
                  padding: cellPadding,
                  borderColor,
                }}
              >
                {resolvePlaceholder(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
/* eslint-enable react/no-array-index-key */

interface ListElementProps {
  element: BuilderElement;
  resolvePlaceholder: (text: string) => string;
}

/* eslint-disable react/no-array-index-key */
const ListElement = ({ element, resolvePlaceholder }: ListElementProps) => {
  const items = (element.props.items as string[] | undefined) ?? ['Item 1', 'Item 2', 'Item 3'];
  const isOrdered = element.props.listType === 'ordered';
  const ListTag = isOrdered ? 'ol' : 'ul';

  return (
    <ListTag
      className={isOrdered ? 'list-decimal' : 'list-disc'}
      style={{
        fontSize: element.props.fontSize ?? '14px',
        color: element.props.color ?? 'inherit',
        paddingLeft: '24px',
        margin: '0',
      }}
    >
      {items.map((item, idx) => (
        <li key={`item-${element.id}-${idx}`} className="py-0.5">
          {resolvePlaceholder(item)}
        </li>
      ))}
    </ListTag>
  );
};
/* eslint-enable react/no-array-index-key */

interface ElementActionsProps {
  element: BuilderElement;
  parentId?: string;
  siblingIndex?: number;
  siblingsCount?: number;
  cannotMove: boolean;
  onMove: (direction: 'up' | 'down') => void;
  onToggleLock: () => void;
  onDelete: (e: MouseEvent) => void;
}

const ElementActions = ({
  element,
  parentId,
  siblingIndex,
  siblingsCount,
  cannotMove,
  onMove,
  onToggleLock,
  onDelete,
}: ElementActionsProps) => {
  const hasParent = typeof parentId === 'string' && parentId.length > 0;

  return (
    <div className="bg-card border-border absolute -top-8 right-0 flex gap-1 rounded border p-1 opacity-0 transition-opacity group-hover:opacity-100">
      {hasParent ? (
        <>
          <Button
            aria-label="Move element up"
            className="h-6 w-6 p-0"
            disabled={siblingIndex === 0 || cannotMove}
            size="sm"
            variant="ghost"
            onClick={() => {
              onMove('up');
            }}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            aria-label="Move element down"
            className="h-6 w-6 p-0"
            disabled={siblingIndex === (siblingsCount ?? 0) - 1 || cannotMove}
            size="sm"
            variant="ghost"
            onClick={() => {
              onMove('down');
            }}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </>
      ) : null}

      <Button
        aria-label={element.locked === true ? 'Unlock element' : 'Lock element'}
        className="h-6 w-6 p-0"
        size="sm"
        variant="ghost"
        onClick={onToggleLock}
      >
        {element.locked === true ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
      </Button>

      <Button
        aria-label="Delete element"
        className="text-destructive hover:text-destructive h-6 w-6 p-0"
        size="sm"
        variant="ghost"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export const CanvasElement = ({
  element,
  isSelected,
  parentId,
  siblingIndex,
  siblingsCount,
}: CanvasElementProps) => {
  const {
    selectElement,
    removeElement,
    addElement,
    updateElement,
    toggleLock,
    isAncestorLocked,
    moveElement,
    moveElementToContainer,
    selectedId,
    resolvePlaceholder,
  } = useBuilder();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.props.text ?? '');
  const [isDragOverNestedArea, setIsDragOverNestedArea] = useState(false);

  const cannotMove = isAncestorLocked(element.id) || element.locked === true;
  const isContainer = element.type === 'row' || element.type === 'column';

  const displayText = resolvePlaceholder(element.props.text ?? 'Click to edit');

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      selectElement(element.id);
    },
    [selectElement, element.id],
  );

  const handleDelete = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      removeElement(element.id);
    },
    [removeElement, element.id],
  );

  const handleTextSave = useCallback(() => {
    updateElement(element.id, {
      props: {
        ...element.props,
        text: editText,
      },
    });
    setIsEditing(false);
  }, [updateElement, element.id, element.props, editText]);

  const handleMove = useCallback(
    (direction: 'up' | 'down') => {
      if (typeof parentId === 'string' && parentId.length > 0 && siblingIndex !== undefined) {
        const newIndex = direction === 'up' ? siblingIndex - 1 : siblingIndex + 1;
        moveElement(siblingIndex, newIndex, parentId);
      }
    },
    [parentId, siblingIndex, moveElement],
  );

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      if (cannotMove) {
        e.preventDefault();
        return;
      }
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData(ELEMENT_ID_DATA_KEY, element.id);
      e.dataTransfer.setData('element-data', JSON.stringify(element));
    },
    [cannotMove, element],
  );

  const handleDragEnd = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOverNestedArea(false);
  }, []);

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const isMovingElement = e.dataTransfer.types.includes(ELEMENT_ID_DATA_KEY);
      const isNewComponent = e.dataTransfer.types.includes('component-type');

      if (isContainer) {
        if (isNewComponent || isMovingElement) {
          e.dataTransfer.dropEffect = 'copy';
          setIsDragOverNestedArea(true);
        }
      } else if (isMovingElement) {
        e.dataTransfer.dropEffect = 'move';
      }
    },
    [isContainer],
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      setIsDragOverNestedArea(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverNestedArea(false);

      const elementId = e.dataTransfer.getData(ELEMENT_ID_DATA_KEY);
      const componentType = e.dataTransfer.getData('component-type');

      if (typeof elementId === 'string' && elementId.length > 0 && isContainer) {
        if (elementId !== element.id) {
          moveElementToContainer(elementId, element.id);
        }
        return;
      }

      if (isElementType(componentType) && isContainer) {
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
    },
    [isContainer, element.id, moveElementToContainer, addElement],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectElement(element.id);
      }
      if (e.key === 'Delete' && isSelected) {
        e.preventDefault();
        removeElement(element.id);
      }
    },
    [selectElement, removeElement, element.id, isSelected],
  );

  const renderElement = () => {
    switch (element.type) {
      case 'row':
      case 'column':
        return (
          <ContainerElement
            element={element}
            isDragOver={isDragOverNestedArea}
            isRow={element.type === 'row'}
            selectedId={selectedId}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        );
      case 'text':
        return (
          <TextElement
            displayText={displayText}
            editText={editText}
            element={element}
            isEditing={isEditing}
            onStartEdit={() => {
              setIsEditing(true);
            }}
            onTextChange={setEditText}
            onTextSave={handleTextSave}
          />
        );
      case 'image':
        return <ImageElement element={element} resolvePlaceholder={resolvePlaceholder} />;
      case 'button':
        return <ButtonElement displayText={displayText} element={element} />;
      case 'spacer':
        return <SpacerElement element={element} />;
      case 'divider':
        return <DividerElement element={element} />;
      case 'table':
        return <TableElement element={element} resolvePlaceholder={resolvePlaceholder} />;
      case 'list':
        return <ListElement element={element} resolvePlaceholder={resolvePlaceholder} />;
      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div
      className={`group relative rounded transition-all duration-200 ${
        isSelected ? 'ring-primary ring-2' : 'hover:border-accent hover:border-dashed'
      } ${!cannotMove ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-60'}`}
      draggable={!cannotMove}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
    >
      {renderElement()}

      {isSelected ? (
        <ElementActions
          cannotMove={cannotMove}
          element={element}
          parentId={parentId}
          siblingIndex={siblingIndex}
          siblingsCount={siblingsCount}
          onDelete={handleDelete}
          onMove={handleMove}
          onToggleLock={() => {
            toggleLock(element.id);
          }}
        />
      ) : null}
    </div>
  );
};
