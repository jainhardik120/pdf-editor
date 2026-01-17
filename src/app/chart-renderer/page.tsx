'use client';

import { useEffect } from 'react';

import { createRoot } from 'react-dom/client';

import { Chart, type ChartData } from './chart';

declare global {
  interface Window {
    renderChart: (data: ChartData) => void;
  }
}

const Page = () => {
  useEffect(() => {
    const element = document.getElementById('chart-root');
    if (element === null) {
      return;
    }
    const root = createRoot(element);
    window.renderChart = (data) => {
      root.render(<Chart data={data} />);
    };
  }, []);

  return <div id="chart-root" />;
};

export default Page;
