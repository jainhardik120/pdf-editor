'use client';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { useHeaderTextStore } from '@/hooks/use-header-store';

import UserButton from './user-button';

const Header = () => {
  const state = useHeaderTextStore();
  return (
    <div className="bg-background sticky top-0 z-9 flex h-16 shrink-0 items-center gap-2 border-b px-4 sm:justify-between">
      <div className="hidden items-center gap-4 sm:flex">
        <Link
          className="flex items-center gap-2 p-2"
          href={state.backNavigation.length > 0 ? state.backNavigation : '/'}
        >
          {state.backNavigation !== '' ? <ArrowLeft className="mr-2 size-4" /> : null}
          <div className="flex flex-col">
            <h1 className="text-xl">{state.primaryText}</h1>
            <h2 className="text-xs">{state.primarySubText}</h2>
          </div>
        </Link>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <p className="text-muted-foreground text-sm">{state.secondaryText}</p>
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
