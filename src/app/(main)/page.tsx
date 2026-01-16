'use client';
import { CanvasArea } from '@/components/pdf-editor/canvas-area';
import { LeftPanel } from '@/components/pdf-editor/left-panel';
import { RightPanel } from '@/components/pdf-editor/right-panel';
import { BuilderProvider } from '@/contexts/builder-context';

export default function Home() {
  return (
    <BuilderProvider>
      <div className="bg-background flex h-full w-full flex-1 flex-col">
        <div className="flex flex-1 overflow-hidden">
          <LeftPanel />
          <CanvasArea />
          <RightPanel />
        </div>
      </div>
    </BuilderProvider>
  );
}
