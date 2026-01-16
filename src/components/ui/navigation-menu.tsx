import * as React from 'react';

import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const NavigationMenu = ({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) => (
  <NavigationMenuPrimitive.Root
    className={cn(
      'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
      className,
    )}
    data-slot="navigation-menu"
    data-viewport={viewport}
    {...props}
  >
    {children}
    {viewport ? <NavigationMenuViewport /> : null}
  </NavigationMenuPrimitive.Root>
);

const NavigationMenuList = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) => (
  <NavigationMenuPrimitive.List
    className={cn('group flex flex-1 list-none items-center justify-center gap-0', className)}
    data-slot="navigation-menu-list"
    {...props}
  />
);

const NavigationMenuItem = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) => (
  <NavigationMenuPrimitive.Item
    className={cn('relative', className)}
    data-slot="navigation-menu-item"
    {...props}
  />
);

const navigationMenuTriggerStyle = cva(
  'bg-background hover:bg-muted focus:bg-muted data-open:hover:bg-muted data-open:focus:bg-muted data-open:bg-muted/50 focus-visible:ring-ring/50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted rounded-none px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-1 focus-visible:outline-1 disabled:opacity-50 group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center disabled:pointer-events-none outline-none',
);

const NavigationMenuTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) => (
  <NavigationMenuPrimitive.Trigger
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    data-slot="navigation-menu-trigger"
    {...props}
  >
    {children}{' '}
    <ChevronDownIcon
      aria-hidden="true"
      className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
    />
  </NavigationMenuPrimitive.Trigger>
);

const NavigationMenuContent = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) => (
  <NavigationMenuPrimitive.Content
    className={cn(
      'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:ring-foreground/10 top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-none group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:duration-300 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto',
      className,
    )}
    data-slot="navigation-menu-content"
    {...props}
  />
);

const NavigationMenuViewport = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) => (
  <div className={cn('absolute top-full left-0 isolate z-50 flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:zoom-out-95 data-open:zoom-in-90 ring-foreground/10 origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-none shadow ring-1 duration-100 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      data-slot="navigation-menu-viewport"
      {...props}
    />
  </div>
);

const NavigationMenuLink = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) => (
  <NavigationMenuPrimitive.Link
    className={cn(
      "data-active:focus:bg-muted data-active:hover:bg-muted data-active:bg-muted/50 focus-visible:ring-ring/50 hover:bg-muted focus:bg-muted flex items-center gap-2 rounded-none p-2 text-xs transition-all outline-none focus-visible:ring-1 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 [[data-slot=navigation-menu-content]_&]:rounded-none",
      className,
    )}
    data-slot="navigation-menu-link"
    {...props}
  />
);

const NavigationMenuIndicator = ({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) => (
  <NavigationMenuPrimitive.Indicator
    className={cn(
      'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      className,
    )}
    data-slot="navigation-menu-indicator"
    {...props}
  >
    <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-none shadow-md" />
  </NavigationMenuPrimitive.Indicator>
);

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
