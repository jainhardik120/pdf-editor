import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ItemGroup = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'group/item-group flex w-full flex-col gap-4 has-[[data-size=sm]]:gap-2.5 has-[[data-size=xs]]:gap-2',
      className,
    )}
    data-slot="item-group"
    role="list"
    {...props}
  />
);

const ItemSeparator = ({ className, ...props }: React.ComponentProps<typeof Separator>) => (
  <Separator
    className={cn('my-2', className)}
    data-slot="item-separator"
    orientation="horizontal"
    {...props}
  />
);

const itemVariants = cva(
  '[a]:hover:bg-muted rounded-none border text-xs w-full group/item focus-visible:border-ring focus-visible:ring-ring/50 flex items-center flex-wrap outline-none transition-colors duration-100 focus-visible:ring-[3px] [a]:transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50 border-transparent',
      },
      size: {
        default: 'gap-2.5 px-3 py-2.5',
        sm: 'gap-2.5 px-3 py-2.5',
        xs: 'gap-2 px-2.5 py-2 [[data-slot=dropdown-menu-content]_&]:p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Item = ({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      className={cn(itemVariants({ variant, size, className }))}
      data-size={size}
      data-slot="item"
      data-variant={variant}
      {...props}
    />
  );
};

const itemMediaVariants = cva(
  'gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          'size-10 overflow-hidden rounded-none group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const ItemMedia = ({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) => (
  <div
    className={cn(itemMediaVariants({ variant, className }))}
    data-slot="item-media"
    data-variant={variant}
    {...props}
  />
);

const ItemContent = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none',
      className,
    )}
    data-slot="item-content"
    {...props}
  />
);

const ItemTitle = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn(
      'line-clamp-1 flex w-fit items-center gap-2 text-xs font-medium underline-offset-4',
      className,
    )}
    data-slot="item-title"
    {...props}
  />
);

const ItemDescription = ({ className, ...props }: React.ComponentProps<'p'>) => (
  <p
    className={cn(
      'text-muted-foreground [&>a:hover]:text-primary line-clamp-2 text-left text-xs/relaxed font-normal group-data-[size=xs]/item:text-xs/relaxed [&>a]:underline [&>a]:underline-offset-4',
      className,
    )}
    data-slot="item-description"
    {...props}
  />
);

const ItemActions = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex items-center gap-2', className)} data-slot="item-actions" {...props} />
);

const ItemHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('flex basis-full items-center justify-between gap-2', className)}
    data-slot="item-header"
    {...props}
  />
);

const ItemFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('flex basis-full items-center justify-between gap-2', className)}
    data-slot="item-footer"
    {...props}
  />
);

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
