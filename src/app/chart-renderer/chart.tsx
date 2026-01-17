import { LineChart, Line, XAxis, YAxis } from 'recharts';

export type ChartData = { name: string; value: number }[];

export const Chart = ({ data }: { data: ChartData }) => (
  <LineChart data={data} height={200} width={400}>
    <XAxis dataKey="name" />
    <YAxis />
    <Line dataKey="value" stroke="#8884d8" type="monotone" />
  </LineChart>
);
