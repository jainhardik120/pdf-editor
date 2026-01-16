import React from 'react';

import Header from './header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
