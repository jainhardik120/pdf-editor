import puppeteer from 'puppeteer';

import type { ChartData } from '@/app/chart-renderer/chart';

const renderChartToSVG = async (data: ChartData) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto('http://localhost:3000/chart-renderer', {
    waitUntil: 'networkidle0',
  });
  await page.evaluate((chartData) => {
    window.renderChart(chartData);
  }, data);

  await page.waitForSelector('svg.recharts-surface');

  const svg = await page.$eval('svg.recharts-surface', (el) => el.outerHTML);

  await browser.close();
  return svg;
};

export const GET = async () => {
  const svgData = await renderChartToSVG([
    { name: 'Page A', value: 1000 },
    { name: 'Page B', value: 3000 },
    { name: 'Page C', value: 2000 },
    { name: 'Page D', value: 2780 },
    { name: 'Page E', value: 1890 },
    { name: 'Page F', value: 2390 },
    { name: 'Page G', value: 3490 },
  ]);
  return Response.json({ svgData });
};
