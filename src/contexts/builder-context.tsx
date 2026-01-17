'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

import { z } from 'zod';

const elementTypes = [
  'row',
  'column',
  'text',
  'image',
  'button',
  'spacer',
  'table',
  'divider',
  'list',
] as const;
const justifyContentValues = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
] as const;
const alignItemsValues = ['flex-start', 'center', 'flex-end', 'stretch'] as const;
const listTypeValues = ['ordered', 'unordered'] as const;
const dividerStyleValues = ['solid', 'dashed', 'dotted'] as const;

export type ElementType = (typeof elementTypes)[number];
export type JustifyContentValue = (typeof justifyContentValues)[number];
export type AlignItemsValue = (typeof alignItemsValues)[number];
export type ListTypeValue = (typeof listTypeValues)[number];
export type DividerStyleValue = (typeof dividerStyleValues)[number];

export const JUSTIFY_CONTENT_OPTIONS = justifyContentValues;
export const ALIGN_ITEMS_OPTIONS = alignItemsValues;
export const LIST_TYPE_OPTIONS = listTypeValues;
export const DIVIDER_STYLE_OPTIONS = dividerStyleValues;

export const isElementType = (value: string): value is ElementType =>
  elementTypes.includes(value as ElementType);

const BasePropsSchema = z.object({
  backgroundColor: z.string().optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
});

const ContainerPropsSchema = BasePropsSchema.extend({
  gap: z.string().optional(),
  justifyContent: z.enum(justifyContentValues).optional(),
  alignItems: z.enum(alignItemsValues).optional(),
});

const TextPropsSchema = BasePropsSchema.extend({
  text: z.string().optional(),
  fontSize: z.string().optional(),
  color: z.string().optional(),
  fontWeight: z.string().optional(),
  textAlign: z.string().optional(),
});

const ImagePropsSchema = BasePropsSchema.extend({
  width: z.string().optional(),
  height: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
});

const ButtonPropsSchema = BasePropsSchema.extend({
  text: z.string().optional(),
  color: z.string().optional(),
});

const SpacerPropsSchema = z.object({
  height: z.string().optional(),
});

const TablePropsSchema = BasePropsSchema.extend({
  rows: z.number().optional(),
  columns: z.number().optional(),
  borderColor: z.string().optional(),
  cellPadding: z.string().optional(),
  headerBackground: z.string().optional(),
  data: z.array(z.array(z.string())).optional(),
});

const DividerPropsSchema = z.object({
  height: z.string().optional(),
  color: z.string().optional(),
  style: z.enum(dividerStyleValues).optional(),
});

const ListPropsSchema = BasePropsSchema.extend({
  items: z.array(z.string()).optional(),
  listType: z.enum(listTypeValues).optional(),
  fontSize: z.string().optional(),
  color: z.string().optional(),
});

export const ElementPropsSchemas = {
  row: ContainerPropsSchema,
  column: ContainerPropsSchema,
  text: TextPropsSchema,
  image: ImagePropsSchema,
  button: ButtonPropsSchema,
  spacer: SpacerPropsSchema,
  table: TablePropsSchema,
  divider: DividerPropsSchema,
  list: ListPropsSchema,
} as const;

export const PropsSchema = z
  .object({
    text: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    backgroundColor: z.string().optional(),
    padding: z.string().optional(),
    margin: z.string().optional(),
    gap: z.string().optional(),
    justifyContent: z.enum(justifyContentValues).optional(),
    alignItems: z.enum(alignItemsValues).optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    textAlign: z.string().optional(),
    color: z.string().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    rows: z.number().optional(),
    columns: z.number().optional(),
    borderColor: z.string().optional(),
    cellPadding: z.string().optional(),
    headerBackground: z.string().optional(),
    data: z.array(z.array(z.string())).optional(),
    style: z.enum(dividerStyleValues).optional(),
    items: z.array(z.string()).optional(),
    listType: z.enum(listTypeValues).optional(),
  })
  .catchall(
    z.union([z.string(), z.number(), z.array(z.string()), z.array(z.array(z.string()))]).optional(),
  );

export type Props = z.infer<typeof PropsSchema>;
export type ContainerProps = z.infer<typeof ContainerPropsSchema>;
export type TextProps = z.infer<typeof TextPropsSchema>;
export type ImageProps = z.infer<typeof ImagePropsSchema>;
export type ButtonProps = z.infer<typeof ButtonPropsSchema>;
export type SpacerProps = z.infer<typeof SpacerPropsSchema>;
export type TableProps = z.infer<typeof TablePropsSchema>;
export type DividerProps = z.infer<typeof DividerPropsSchema>;
export type ListProps = z.infer<typeof ListPropsSchema>;

export interface BuilderElement {
  id: string;
  type: ElementType;
  children: BuilderElement[];
  locked?: boolean;
  props: Props;
}

export interface DocumentPage {
  id: string;
  name: string;
  elements: BuilderElement[];
}

export interface DocumentSettings {
  header: BuilderElement[];
  footer: BuilderElement[];
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

export type PlaceholderValues = Record<string, string>;

const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  header: [],
  footer: [],
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: '20mm',
    right: '20mm',
    bottom: '20mm',
    left: '20mm',
  },
};

interface BuilderContextType {
  pages: DocumentPage[];
  currentPageId: string | null;
  selectedId: string | null;
  documentSettings: DocumentSettings;
  elements: BuilderElement[];
  placeholderValues: PlaceholderValues;
  setElements: (elements: BuilderElement[]) => void;
  addElement: (element: BuilderElement, parentId?: string) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  selectElement: (id: string | null) => void;
  getSelectedElement: () => BuilderElement | null;
  moveElement: (fromIndex: number, toIndex: number, parentId?: string) => void;
  moveElementToContainer: (elementId: string, targetContainerId: string) => void;
  moveElementToRoot: (elementId: string) => void;
  findElement: (id: string) => BuilderElement | null;
  toggleLock: (id: string) => void;
  isAncestorLocked: (id: string) => boolean;
  exportJSON: () => string;
  resetElements: () => void;
  addPage: () => void;
  removePage: (pageId: string) => void;
  selectPage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  updateDocumentSettings: (settings: Partial<DocumentSettings>) => void;
  addHeaderElement: (element: BuilderElement) => void;
  addFooterElement: (element: BuilderElement) => void;
  removeHeaderElement: (id: string) => void;
  removeFooterElement: (id: string) => void;
  setPlaceholderValues: (values: PlaceholderValues) => void;
  getPlaceholders: () => string[];
  resolvePlaceholder: (text: string) => string;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const createDefaultPage = (index: number): DocumentPage => ({
  id: `page-${Date.now()}-${index}`,
  name: `Page ${index + 1}`,
  elements: [],
});

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

const updatePageElements = (
  pages: DocumentPage[],
  targetPageId: string | undefined,
  updater: (elements: BuilderElement[]) => BuilderElement[],
): DocumentPage[] => {
  return pages.map((page) => {
    if (page.id !== targetPageId) {
      return page;
    }
    return { ...page, elements: updater(page.elements) };
  });
};

const addChildToElement = (parent: BuilderElement, child: BuilderElement): BuilderElement => ({
  ...parent,
  children: [...parent.children, child],
});

const addElementToPage = (
  pages: DocumentPage[],
  targetPageId: string | undefined,
  element: BuilderElement,
  parentId?: string,
): DocumentPage[] => {
  if (parentId === undefined) {
    return updatePageElements(pages, targetPageId, (elements) => [...elements, element]);
  }
  return updatePageElements(pages, targetPageId, (elements) =>
    updateElementInTree(elements, parentId, (parent) => addChildToElement(parent, element)),
  );
};

const updateElementInPage = (
  pages: DocumentPage[],
  targetPageId: string | undefined,
  elementId: string,
  updates: Partial<BuilderElement>,
): DocumentPage[] => {
  return updatePageElements(pages, targetPageId, (elements) =>
    updateElementInTree(elements, elementId, (element) => applyUpdates(element, updates)),
  );
};

const moveElementInPage = (
  pages: DocumentPage[],
  targetPageId: string | undefined,
  fromIndex: number,
  toIndex: number,
  parentId?: string,
): DocumentPage[] => {
  if (parentId === undefined) {
    return updatePageElements(pages, targetPageId, (elements) => {
      const newElements = [...elements];
      const [moved] = newElements.splice(fromIndex, 1);
      newElements.splice(toIndex, 0, moved);
      return newElements;
    });
  }
  return updatePageElements(pages, targetPageId, (elements) =>
    updateElementInTree(elements, parentId, (parent) =>
      reorderChildren(parent, fromIndex, toIndex),
    ),
  );
};

const toggleLockInPage = (
  pages: DocumentPage[],
  targetPageId: string | undefined,
  elementId: string,
): DocumentPage[] => {
  return updatePageElements(pages, targetPageId, (elements) =>
    updateElementInTree(elements, elementId, toggleElementLock),
  );
};

const moveElementToContainerInPage = (
  pages: DocumentPage[],
  targetPageId: string | undefined,
  currentPageData: DocumentPage,
  elementId: string,
  targetContainerId: string,
): DocumentPage[] => {
  const elementToMove = findElementInTree(currentPageData.elements, elementId);
  if (elementToMove === null) {
    return pages;
  }

  const targetContainer = findElementInTree(currentPageData.elements, targetContainerId);
  if (
    targetContainer === null ||
    (targetContainer.type !== 'row' && targetContainer.type !== 'column')
  ) {
    return pages;
  }

  return updatePageElements(pages, targetPageId, (elements) => {
    const withoutElement = removeElementFromTree(elements, elementId);
    return updateElementInTree(withoutElement, targetContainerId, (container) =>
      addChildToElement(container, elementToMove),
    );
  });
};

const applyUpdates = (
  element: BuilderElement,
  updates: Partial<BuilderElement>,
): BuilderElement => ({
  ...element,
  ...updates,
});

const toggleElementLock = (element: BuilderElement): BuilderElement => ({
  ...element,
  locked: element.locked !== true,
});

const reorderChildren = (
  parent: BuilderElement,
  fromIndex: number,
  toIndex: number,
): BuilderElement => {
  const newChildren = [...parent.children];
  const [moved] = newChildren.splice(fromIndex, 1);
  newChildren.splice(toIndex, 0, moved);
  return { ...parent, children: newChildren };
};

const getTargetPageId = (
  currentPageId: string | null,
  pages: DocumentPage[],
): string | undefined => {
  return currentPageId ?? pages[0]?.id;
};

const PLACEHOLDER_REGEX = /\{\{([^{}]+)\}\}/g;

const extractPlaceholdersFromElement = (element: BuilderElement): string[] => {
  const placeholders: string[] = [];
  const { props } = element;

  const extractFromString = (str: string | undefined): void => {
    if (str === undefined) {
      return;
    }
    const matches = str.matchAll(PLACEHOLDER_REGEX);
    for (const match of matches) {
      if (match[1] !== undefined && placeholders.includes(match[1]) === false) {
        placeholders.push(match[1]);
      }
    }
  };

  extractFromString(props.text);
  extractFromString(props.src);
  extractFromString(props.alt);

  if (Array.isArray(props.items)) {
    for (const item of props.items) {
      extractFromString(item);
    }
  }

  if (Array.isArray(props.data)) {
    for (const row of props.data) {
      if (Array.isArray(row)) {
        for (const cell of row) {
          extractFromString(cell);
        }
      }
    }
  }

  for (const child of element.children) {
    placeholders.push(...extractPlaceholdersFromElement(child));
  }

  return placeholders;
};

// eslint-disable-next-line max-statements
export const BuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const initialPage = createDefaultPage(0);
  const [pages, setPages] = useState<DocumentPage[]>([initialPage]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(initialPage.id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [documentSettings, setDocumentSettings] =
    useState<DocumentSettings>(DEFAULT_DOCUMENT_SETTINGS);
  const [placeholderValues, setPlaceholderValues] = useState<PlaceholderValues>({});

  const currentPage = useMemo(() => {
    if (pages.length === 0) {
      return null;
    }
    return pages.find((p) => p.id === currentPageId) ?? pages[0];
  }, [pages, currentPageId]);

  const elements = useMemo(() => currentPage?.elements ?? [], [currentPage]);

  const setElements = useCallback(
    (newElements: BuilderElement[]) => {
      setPages((prev) =>
        prev.map((page) =>
          page.id === getTargetPageId(currentPageId, prev)
            ? { ...page, elements: newElements }
            : page,
        ),
      );
    },
    [currentPageId],
  );

  const addElement = useCallback(
    (element: BuilderElement, parentId?: string) => {
      setPages((prev) =>
        addElementToPage(prev, getTargetPageId(currentPageId, prev), element, parentId),
      );
    },
    [currentPageId],
  );

  const removeElement = useCallback(
    (id: string) => {
      if (selectedId === id) {
        setSelectedId(null);
      }
      setPages((prev) => {
        const targetPageId = getTargetPageId(currentPageId, prev);
        return updatePageElements(prev, targetPageId, (els) => removeElementFromTree(els, id));
      });
    },
    [selectedId, currentPageId],
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<BuilderElement>) => {
      setPages((prev) =>
        updateElementInPage(prev, getTargetPageId(currentPageId, prev), id, updates),
      );
    },
    [currentPageId],
  );

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const getSelectedElement = useCallback(() => {
    return findElementInTree(elements, selectedId);
  }, [elements, selectedId]);

  const moveElement = useCallback(
    (fromIndex: number, toIndex: number, parentId?: string) => {
      setPages((prev) =>
        moveElementInPage(prev, getTargetPageId(currentPageId, prev), fromIndex, toIndex, parentId),
      );
    },
    [currentPageId],
  );

  const moveElementToContainer = useCallback(
    (elementId: string, targetContainerId: string) => {
      setPages((prev) => {
        const targetPageId = getTargetPageId(currentPageId, prev);
        const currentPageData = prev.find((p) => p.id === targetPageId);
        if (currentPageData === undefined) {
          return prev;
        }
        return moveElementToContainerInPage(
          prev,
          targetPageId,
          currentPageData,
          elementId,
          targetContainerId,
        );
      });
    },
    [currentPageId],
  );

  const moveElementToRoot = useCallback(
    (elementId: string) => {
      setPages((prev) => {
        const targetPageId = getTargetPageId(currentPageId, prev);
        const currentPageData = prev.find((p) => p.id === targetPageId);
        if (currentPageData === undefined) {
          return prev;
        }

        const isAlreadyAtRoot = currentPageData.elements.some((el) => el.id === elementId);
        if (isAlreadyAtRoot) {
          return prev;
        }

        const elementToMove = findElementInTree(currentPageData.elements, elementId);
        if (elementToMove === null) {
          return prev;
        }

        return updatePageElements(prev, targetPageId, (elements) => {
          const withoutElement = removeElementFromTree(elements, elementId);
          return [...withoutElement, elementToMove];
        });
      });
    },
    [currentPageId],
  );

  const findElement = useCallback(
    (id: string) => {
      return findElementInTree(elements, id);
    },
    [elements],
  );

  const toggleLock = useCallback(
    (id: string) => {
      setPages((prev) => toggleLockInPage(prev, getTargetPageId(currentPageId, prev), id));
    },
    [currentPageId],
  );

  const isAncestorLocked = useCallback(
    (id: string) => {
      const checkAncestors = (
        elementsList: BuilderElement[],
        targetId: string,
        ancestorLocked: boolean,
      ): boolean | null => {
        for (const element of elementsList) {
          if (element.id === targetId) {
            return ancestorLocked;
          }
          if (element.children.length > 0) {
            const foundInChildren = checkAncestors(
              element.children,
              targetId,
              ancestorLocked || element.locked === true,
            );
            if (foundInChildren !== null) {
              return foundInChildren;
            }
          }
        }
        return null;
      };
      return checkAncestors(elements, id, false) ?? false;
    },
    [elements],
  );

  const exportJSON = useCallback(() => {
    return JSON.stringify({ pages, documentSettings, placeholderValues }, null, 2);
  }, [pages, documentSettings, placeholderValues]);

  const resetElements = useCallback(() => {
    setPages([createDefaultPage(0)]);
    setCurrentPageId(null);
    setSelectedId(null);
    setDocumentSettings(DEFAULT_DOCUMENT_SETTINGS);
    setPlaceholderValues({});
  }, []);

  const addPage = useCallback(() => {
    const newPage = createDefaultPage(pages.length);
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newPage.id);
  }, [pages.length]);

  const removePage = useCallback(
    (pageId: string) => {
      if (pages.length <= 1) {
        return;
      }
      setPages((prev) => {
        const filtered = prev.filter((p) => p.id !== pageId);
        if (currentPageId === pageId) {
          setCurrentPageId(filtered[0]?.id ?? null);
        }
        return filtered;
      });
    },
    [pages.length, currentPageId],
  );

  const selectPage = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    setSelectedId(null);
  }, []);

  const renamePage = useCallback((pageId: string, name: string) => {
    setPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, name } : page)));
  }, []);

  const updateDocumentSettings = useCallback((settings: Partial<DocumentSettings>) => {
    setDocumentSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const addHeaderElement = useCallback((element: BuilderElement) => {
    setDocumentSettings((prev) => ({
      ...prev,
      header: [...prev.header, element],
    }));
  }, []);

  const addFooterElement = useCallback((element: BuilderElement) => {
    setDocumentSettings((prev) => ({
      ...prev,
      footer: [...prev.footer, element],
    }));
  }, []);

  const removeHeaderElement = useCallback((id: string) => {
    setDocumentSettings((prev) => ({
      ...prev,
      header: removeElementFromTree(prev.header, id),
    }));
  }, []);

  const removeFooterElement = useCallback((id: string) => {
    setDocumentSettings((prev) => ({
      ...prev,
      footer: removeElementFromTree(prev.footer, id),
    }));
  }, []);

  const getPlaceholders = useCallback((): string[] => {
    const allPlaceholders: string[] = [];

    for (const page of pages) {
      for (const element of page.elements) {
        allPlaceholders.push(...extractPlaceholdersFromElement(element));
      }
    }

    for (const element of documentSettings.header) {
      allPlaceholders.push(...extractPlaceholdersFromElement(element));
    }
    for (const element of documentSettings.footer) {
      allPlaceholders.push(...extractPlaceholdersFromElement(element));
    }

    return [...new Set(allPlaceholders)];
  }, [pages, documentSettings.header, documentSettings.footer]);

  const resolvePlaceholder = useCallback(
    (text: string): string => {
      return text.replace(PLACEHOLDER_REGEX, (match, key: string) => {
        return placeholderValues[key] ?? match;
      });
    },
    [placeholderValues],
  );

  const contextValue = useMemo(
    () => ({
      pages,
      currentPageId,
      selectedId,
      documentSettings,
      elements,
      placeholderValues,
      setElements,
      addElement,
      removeElement,
      updateElement,
      selectElement,
      getSelectedElement,
      moveElement,
      moveElementToContainer,
      moveElementToRoot,
      findElement,
      toggleLock,
      isAncestorLocked,
      exportJSON,
      resetElements,
      addPage,
      removePage,
      selectPage,
      renamePage,
      updateDocumentSettings,
      addHeaderElement,
      addFooterElement,
      removeHeaderElement,
      removeFooterElement,
      setPlaceholderValues,
      getPlaceholders,
      resolvePlaceholder,
    }),
    [
      pages,
      currentPageId,
      selectedId,
      documentSettings,
      elements,
      placeholderValues,
      setElements,
      addElement,
      removeElement,
      updateElement,
      selectElement,
      getSelectedElement,
      moveElement,
      moveElementToContainer,
      moveElementToRoot,
      findElement,
      toggleLock,
      isAncestorLocked,
      exportJSON,
      resetElements,
      addPage,
      removePage,
      selectPage,
      renamePage,
      updateDocumentSettings,
      addHeaderElement,
      addFooterElement,
      removeHeaderElement,
      removeFooterElement,
      setPlaceholderValues,
      getPlaceholders,
      resolvePlaceholder,
    ],
  );

  return <BuilderContext.Provider value={contextValue}>{children}</BuilderContext.Provider>;
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
};
