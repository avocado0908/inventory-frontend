import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlyStockComparisonProps = {
  data: { month: string; total: number }[];
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function formatMonthLabel(value: string) {
  if (!value) return value;
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", { month: "short" });
}

export function MonthlyStockComparison({ data }: MonthlyStockComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Stock Value Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatMonthLabel(String(value))}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => formatMonthLabel(String(label))}
              cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#1E293B" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
