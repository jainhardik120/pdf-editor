'use client';

import * as React from 'react';

import { ChevronRightIcon, CheckIcon } from 'lucide-react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const ContextMenu = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) => (
  <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
);

const ContextMenuTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) => (
  <ContextMenuPrimitive.Trigger
    className={cn('select-none', className)}
    data-slot="context-menu-trigger"
    {...props}
  />
);

const ContextMenuGroup = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) => (
  <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
);

const ContextMenuPortal = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) => (
  <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
);

const ContextMenuSub = ({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) => (
  <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
);

const ContextMenuRadioGroup = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) => (
  <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
);

const ContextMenuContent = ({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      className={cn(
        'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground z-50 max-h-(--radix-context-menu-content-available-height) min-w-36 origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-none shadow-md ring-1 duration-100',
        className,
      )}
      data-slot="context-menu-content"
      {...props}
    />
  </ContextMenuPrimitive.Portal>
);

const ContextMenuItem = ({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) => (
  <ContextMenuPrimitive.Item
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive focus:*:[svg]:text-accent-foreground group/context-menu-item relative flex cursor-default items-center gap-2 rounded-none px-2 py-2 text-xs outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    data-inset={inset}
    data-slot="context-menu-item"
    data-variant={variant}
    {...props}
  />
);

const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.SubTrigger
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground flex cursor-default items-center gap-2 rounded-none px-2 py-2 text-xs outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    data-inset={inset}
    data-slot="context-menu-sub-trigger"
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto" />
  </ContextMenuPrimitive.SubTrigger>
);

const ContextMenuSubContent = ({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) => (
  <ContextMenuPrimitive.SubContent
    className={cn(
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground z-50 min-w-32 origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-none border shadow-lg duration-100',
      className,
    )}
    data-slot="context-menu-sub-content"
    {...props}
  />
);

const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) => (
  <ContextMenuPrimitive.CheckboxItem
    checked={checked}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-none py-2 pr-8 pl-2 text-xs outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    data-slot="context-menu-checkbox-item"
    {...props}
  >
    <span className="pointer-events-none absolute right-2">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
);

const ContextMenuRadioItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) => (
  <ContextMenuPrimitive.RadioItem
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-none py-2 pr-8 pl-2 text-xs outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    data-slot="context-menu-radio-item"
    {...props}
  >
    <span className="pointer-events-none absolute right-2">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
);

const ContextMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) => (
  <ContextMenuPrimitive.Label
    className={cn('text-muted-foreground px-2 py-2 text-xs data-[inset]:pl-8', className)}
    data-inset={inset}
    data-slot="context-menu-label"
    {...props}
  />
);

const ContextMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) => (
  <ContextMenuPrimitive.Separator
    className={cn('bg-border -mx-1 h-px', className)}
    data-slot="context-menu-separator"
    {...props}
  />
);

const ContextMenuShortcut = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    className={cn(
      'text-muted-foreground group-focus/context-menu-item:text-accent-foreground ml-auto text-xs tracking-widest',
      className,
    )}
    data-slot="context-menu-shortcut"
    {...props}
  />
);

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
