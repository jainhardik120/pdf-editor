import { cn } from '@/lib/utils';

const Skeleton = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div
    className={cn('bg-muted animate-pulse rounded-none', className)}
    data-slot="skeleton"
    {...props}
  />
);

export { Skeleton };
