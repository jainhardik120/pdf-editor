import { ThemeToggle } from '@/components/theme-toggle';

import UserButton from './user-button';

const Header = () => {
  return (
    <div className="bg-background sticky top-0 z-9 flex h-16 shrink-0 items-center gap-2 border-b px-4 sm:justify-between">
      <h1 className="hidden text-2xl font-bold sm:block">PDF Designer</h1>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
