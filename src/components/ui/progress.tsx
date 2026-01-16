'use client';

import * as React from 'react';

import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const Progress = ({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) => (
  <ProgressPrimitive.Root
    className={cn(
      'bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-none',
      className,
    )}
    data-slot="progress"
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="bg-primary size-full flex-1 transition-all"
      data-slot="progress-indicator"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
);

export { Progress };
