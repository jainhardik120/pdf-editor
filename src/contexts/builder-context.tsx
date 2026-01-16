'use client';

import { createContext, useContext, useState, useCallback } from 'react';

import { z } from 'zod';

const elementTypes = ['row', 'column', 'text', 'image', 'button', 'spacer'] as const;

export type ElementType = (typeof elementTypes)[number];

export const isElementType = (value: string): value is ElementType =>
  elementTypes.includes(value as ElementType);
export const PropsSchema = z
  .object({
    text: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    backgroundColor: z.string().optional(),
    padding: z.string().optional(),
    margin: z.string().optional(),
    gap: z.string().optional(),
    justifyContent: z.string().optional(),
    alignItems: z.string().optional(),
    columns: z.number().optional(),
    fontSize: z.string().optional(),
    color: z.string().optional(),
  })
  .catchall(z.union([z.string(), z.number()]).optional());

export type Props = z.infer<typeof PropsSchema>;

export interface BuilderElement {
  id: string;
  type: ElementType;
  children: BuilderElement[];
  locked?: boolean;
  props: Props;
}

interface BuilderContextType {
  elements: BuilderElement[];
  selectedId: string | null;
  setElements: (elements: BuilderElement[]) => void;
  addElement: (element: BuilderElement, parentId?: string) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  selectElement: (id: string | null) => void;
  getSelectedElement: () => BuilderElement | null;
  moveElement: (fromIndex: number, toIndex: number, parentId?: string) => void;
  moveElementToContainer: (elementId: string, targetContainerId: string) => void;
  findElement: (id: string) => BuilderElement | null;
  toggleLock: (id: string) => void;
  isAncestorLocked: (id: string) => boolean;
  exportJSON: () => string;
  resetElements: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

interface BuilderProviderProps {
  children: React.ReactNode;
}

// eslint-disable-next-line react/prop-types
export const BuilderProvider: React.FC<BuilderProviderProps> = ({ children }) => {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addElement = useCallback((element: BuilderElement, parentId?: string) => {
    if (parentId === undefined) {
      setElements((prev) => [...prev, element]);
    } else {
      setElements((prev) =>
        updateElementInTree(prev, parentId, (parent) => ({
          ...parent,
          children: [...parent.children, element],
        })),
      );
    }
  }, []);

  const removeElement = useCallback(
    (id: string) => {
      if (selectedId === id) {
        setSelectedId(null);
      }
      setElements((prev) => removeElementFromTree(prev, id));
    },
    [selectedId],
  );

  const updateElement = useCallback((id: string, updates: Partial<BuilderElement>) => {
    setElements((prev) =>
      updateElementInTree(prev, id, (element) => ({
        ...element,
        ...updates,
      })),
    );
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const getSelectedElement = useCallback(() => {
    return findElementInTree(elements, selectedId);
  }, [elements, selectedId]);

  const moveElement = useCallback((fromIndex: number, toIndex: number, parentId?: string) => {
    setElements((prev) => {
      if (parentId === undefined) {
        const newElements = [...prev];
        const [moved] = newElements.splice(fromIndex, 1);
        newElements.splice(toIndex, 0, moved);
        return newElements;
      }
      return updateElementInTree(prev, parentId, (parent) => {
        const newChildren = [...parent.children];
        const [moved] = newChildren.splice(fromIndex, 1);
        newChildren.splice(toIndex, 0, moved);
        return { ...parent, children: newChildren };
      });
    });
  }, []);

  const moveElementToContainer = useCallback((elementId: string, targetContainerId: string) => {
    setElements((prev) => {
      const elementToMove = findElementInTree(prev, elementId);
      if (elementToMove === null) {
        return prev;
      }

      const targetContainer = findElementInTree(prev, targetContainerId);
      if (
        targetContainer === null ||
        (targetContainer.type !== 'row' && targetContainer.type !== 'column')
      ) {
        return prev;
      }

      const withoutElement = removeElementFromTree(prev, elementId);
      return updateElementInTree(withoutElement, targetContainerId, (container) => ({
        ...container,
        children: [...container.children, elementToMove],
      }));
    });
  }, []);

  const findElement = useCallback(
    (id: string) => {
      return findElementInTree(elements, id);
    },
    [elements],
  );

  const toggleLock = useCallback((id: string) => {
    setElements((prev) =>
      updateElementInTree(prev, id, (element) => ({
        ...element,
        locked: element.locked !== true,
      })),
    );
  }, []);

  const isAncestorLocked = useCallback(
    (id: string) => {
      const checkAncestors = (elements: BuilderElement[], targetId: string): boolean => {
        for (const element of elements) {
          if (element.locked === true) {
            return true;
          }
          if (
            element.children.length > 0 &&
            findElementInTree(element.children, targetId) !== null
          ) {
            return element.locked ?? checkAncestors(element.children, targetId);
          }
        }
        return false;
      };
      return checkAncestors(elements, id);
    },
    [elements],
  );

  const exportJSON = useCallback(() => {
    return JSON.stringify(elements, null, 2);
  }, [elements]);

  const resetElements = useCallback(() => {
    setElements([]);
    setSelectedId(null);
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        elements,
        selectedId,
        setElements,
        addElement,
        removeElement,
        updateElement,
        selectElement,
        getSelectedElement,
        moveElement,
        moveElementToContainer,
        findElement,
        toggleLock,
        isAncestorLocked,
        exportJSON,
        resetElements,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
};

// Helper functions
const updateElementInTree = (
  elements: BuilderElement[],
  id: string | null,
  updater: (element: BuilderElement) => BuilderElement,
): BuilderElement[] =>
  elements.map((element) => {
    if (element.id === id) {
      return updater(element);
    }
    if (element.children.length > 0) {
      return {
        ...element,
        children: updateElementInTree(element.children, id, updater),
      };
    }
    return element;
  });

const removeElementFromTree = (elements: BuilderElement[], id: string): BuilderElement[] =>
  elements
    .filter((element) => element.id !== id)
    .map((element) => ({
      ...element,
      children: removeElementFromTree(element.children, id),
    }));

const findElementInTree = (
  elements: BuilderElement[],
  id: string | null,
): BuilderElement | null => {
  if (id === null) {
    return null;
  }
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    const found = findElementInTree(element.children, id);
    if (found !== null) {
      return found;
    }
  }
  return null;
};
