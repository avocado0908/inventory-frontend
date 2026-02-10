import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useList } from "@refinedev/core";
import { MonthlyStockComparison } from "./dashboardComponents/MonthlyStockComparison";
import { BranchValueRank } from "./dashboardComponents/BranchValueRank";

type Kpi = {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down";
};

type LocationStock = {
  id: string;
  name: string;
  value: number;
  changePct: number;
};

type CategoryStock = {
  name: string;
  value: number;
};

type AlertItem = {
  id: string;
  severity: "High" | "Medium";
  message: string;
  link: string;
};

type ProgressRow = {
  id: string;
  location: string;
  status: "Done" | "In Progress" | "Not Started";
  assignedTo: string;
  updatedAt: string;
  action: string;
};

type TransferRoute = {
  from: string;
  to: string;
  value: number;
};

type StocktakeSummary = {
  id: number;
  branchAssignmentId: number;
  grandTotal: string | number;
  assignedMonth: string;
  assignmentName?: string;
  totalsByCategory?: { category: string; totalValue: number }[];
};
type BranchAssignment = {
  id: number;
  assignedMonth: string;
  status: string;
};
type Branch = {
  id: number;
};

const stockByLocation: LocationStock[] = [
  { id: "1", name: "Refuel", value: 312000, changePct: 4.8 },
  { id: "2", name: "Groove", value: 286000, changePct: -1.9 },
  { id: "3", name: "Harbor", value: 214000, changePct: 2.1 },
  { id: "4", name: "Vista", value: 192000, changePct: 0.4 },
  { id: "5", name: "Aurora", value: 144900, changePct: -0.8 },
];

const stockByCategory: CategoryStock[] = [
  { name: "Meat", value: 220000 },
  { name: "Poultry", value: 140000 },
  { name: "Seafood", value: 125000 },
  { name: "Dairy", value: 98000 },
  { name: "Dry Goods", value: 165000 },
  { name: "Frozen", value: 112000 },
  { name: "Fresh Produce", value: 151000 },
  { name: "Bakery", value: 76000 },
  { name: "Drinks", value: 210000 },
  { name: "Packaging", value: 52000 },
];

const alerts: AlertItem[] = [
  {
    id: "1",
    severity: "High",
    message: "Salmon fillet variance -18% at Groove",
    link: "/products/seafood/salmon-fillet",
  },
  {
    id: "2",
    severity: "High",
    message: "Ribeye zero count (high value) at Refuel",
    link: "/products/meat/ribeye",
  },
  {
    id: "3",
    severity: "Medium",
    message: "Vista stocktake not completed",
    link: "/locations/4",
  },
  {
    id: "4",
    severity: "Medium",
    message: "Unusual transfer: Refuel → Groove ($18.4k)",
    link: "/transfers",
  },
];

const progressRows: ProgressRow[] = [
  {
    id: "1",
    location: "Refuel",
    status: "Done",
    assignedTo: "Emily",
    updatedAt: "Today 09:18",
    action: "/stockcount?branchAssignmentsId=1",
  },
  {
    id: "2",
    location: "Groove",
    status: "In Progress",
    assignedTo: "Ari",
    updatedAt: "Today 08:41",
    action: "/stockcount?branchAssignmentsId=2",
  },
  {
    id: "3",
    location: "Harbor",
    status: "In Progress",
    assignedTo: "Noah",
    updatedAt: "Yesterday 17:02",
    action: "/stockcount?branchAssignmentsId=3",
  },
  {
    id: "4",
    location: "Vista",
    status: "Not Started",
    assignedTo: "Jules",
    updatedAt: "—",
    action: "/stockcount?branchAssignmentsId=4",
  },
];

const transferSummary = {
  totalValue: 62400,
  netByLocation: [
    { name: "Refuel", value: -18400 },
    { name: "Groove", value: 12300 },
    { name: "Harbor", value: 7400 },
    { name: "Vista", value: -3900 },
  ],
  topRoutes: [
    { from: "Refuel", to: "Groove", value: 18400 },
    { from: "Harbor", to: "Vista", value: 11200 },
    { from: "Groove", to: "Aurora", value: 8600 },
    { from: "Refuel", to: "Harbor", value: 7200 },
    { from: "Aurora", to: "Vista", value: 6000 },
  ] as TransferRoute[],
};

const categoryColors = [
  "#2F4B7C",
  "#00A5CF",
  "#7A5195",
  "#EF5675",
  "#FFA600",
  "#4ECDC4",
  "#1B998B",
  "#5D2E8C",
  "#F0B429",
  "#B0BEC5",
];

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function formatCurrencyK(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return formatCurrency(value);
}

function StatusBadge({ status }: { status: ProgressRow["status"] }) {
  const variant =
    status === "Done"
      ? "secondary"
      : status === "In Progress"
      ? "default"
      : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-sm text-red-600">
          Dashboard failed to render: {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DashboardPage() {
  const currentMonthValue = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);
  const { query: summariesQuery } = useList<StocktakeSummary>({
    resource: "stocktake-summaries",
    pagination: { pageSize: 10000 },
  });
  const { query: assignmentsQuery } = useList<BranchAssignment>({
    resource: "branch-assignments",
    pagination: { pageSize: 10000 },
  });
  const { query: branchesQuery } = useList<Branch>({
    resource: "branches",
    pagination: { pageSize: 10000 },
  });

  // If the current selected month has no summaries, fall back to latest available month
  React.useEffect(() => {
    const summaries = Array.isArray(summariesQuery.data)
      ? summariesQuery.data
      : summariesQuery.data?.data ?? [];
    if (summaries.length === 0) return;
    const months = Array.from(
      new Set(
        summaries
          .map((s) => s.assignedMonth?.slice(0, 7))
          .filter(Boolean) as string[]
      )
    ).sort();
    if (months.length === 0) return;
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [summariesQuery.data?.data, selectedMonth]);

  const monthlyGrandTotal = useMemo(() => {
    const summaries = Array.isArray(summariesQuery.data)
      ? summariesQuery.data
      : summariesQuery.data?.data ?? [];
    return summaries
      .filter((summary) => summary.assignedMonth?.slice(0, 7) === selectedMonth)
      .reduce((sum, summary) => sum + Number(summary.grandTotal ?? 0), 0);
  }, [summariesQuery.data, selectedMonth]);

  const previousMonthValue = useMemo(() => {
    const summaries = Array.isArray(summariesQuery.data)
      ? summariesQuery.data
      : summariesQuery.data?.data ?? [];
    if (!selectedMonth || summaries.length === 0) return null;
    const months = Array.from(
      new Set(
        summaries
          .map((s) => s.assignedMonth?.slice(0, 7))
          .filter(Boolean) as string[]
      )
    ).sort();
    const idx = months.indexOf(selectedMonth);
    if (idx <= 0) return null;
    return months[idx - 1];
  }, [summariesQuery.data, selectedMonth]);

  const previousMonthTotal = useMemo(() => {
    if (!previousMonthValue) return 0;
    const summaries = Array.isArray(summariesQuery.data)
      ? summariesQuery.data
      : summariesQuery.data?.data ?? [];
    return summaries
      .filter((summary) => summary.assignedMonth?.slice(0, 7) === previousMonthValue)
      .reduce((sum, summary) => sum + Number(summary.grandTotal ?? 0), 0);
  }, [summariesQuery.data, previousMonthValue]);

  const { completedCount, totalCount } = useMemo(() => {
    const assignments = Array.isArray(assignmentsQuery.data)
      ? assignmentsQuery.data
      : assignmentsQuery.data?.data ?? [];
    const monthAssignments = assignments.filter(
      (a) => a.assignedMonth?.slice(0, 7) === selectedMonth
    );
    const completed = monthAssignments.filter((a) => a.status === "done").length;
    return { completedCount: completed, totalCount: monthAssignments.length };
  }, [assignmentsQuery.data, selectedMonth]);

  const totalBranches = useMemo(() => {
    const branches = Array.isArray(branchesQuery.data)
      ? branchesQuery.data
      : branchesQuery.data?.data ?? [];
    return branches.length;
  }, [branchesQuery.data]);

  const changePercent = useMemo(() => {
    if (previousMonthTotal === 0) return null;
    return ((monthlyGrandTotal - previousMonthTotal) / previousMonthTotal) * 100;
  }, [monthlyGrandTotal, previousMonthTotal]);

  const changeValue = monthlyGrandTotal - previousMonthTotal;

  const monthlyComparisonData = useMemo(() => {
    const summaries = Array.isArray(summariesQuery.data)
      ? summariesQuery.data
      : summariesQuery.data?.data ?? [];
    const monthTotals = summaries.reduce<Record<string, number>>((acc, summary) => {
      const key = summary.assignedMonth?.slice(0, 7);
      if (!key) return acc;
      acc[key] = (acc[key] ?? 0) + Number(summary.grandTotal ?? 0);
      return acc;
    }, {});
    const months = Object.keys(monthTotals).sort();
    const lastSix = months.slice(-6);
    return lastSix.map((month) => ({
      month,
      total: monthTotals[month],
    }));
  }, [summariesQuery.data]);

  const branchRankData = useMemo(() => {
    const summaries = Array.isArray(summariesQuery.data)
      ? summariesQuery.data
      : summariesQuery.data?.data ?? [];
    const filtered = summaries.filter(
      (summary) => summary.assignedMonth?.slice(0, 7) === selectedMonth
    );
    return filtered
      .map((summary) => ({
        id: summary.branchAssignmentId,
        name: summary.assignmentName || String(summary.branchAssignmentId),
        total: Number(summary.grandTotal ?? 0),
        totalsByCategory: summary.totalsByCategory ?? [],
      }))
      .sort((a, b) => b.total - a.total);
  }, [summariesQuery.data, selectedMonth]);

  const kpis: Kpi[] = [
    {
      label: "Total Stock Value (GST Exclusive)",
      value: formatCurrencyK(monthlyGrandTotal),
      subValue:
        changePercent === null
          ? "No prior month"
          : `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}% from last month`,
      trend: changePercent === null ? undefined : changePercent >= 0 ? "up" : "down",
    },
    {
      label: "Locations Completed",
      value: `${completedCount} / ${totalBranches || 0}`,
    },
  ];

  return (
    <DashboardErrorBoundary>
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Monthly Stocktake Overview</h1>
        <p className="text-sm text-muted-foreground">
          Quick snapshot of stock value, risk, and progress for the month.
        </p>
        <div className="mt-4 w-48">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      <KpiCards items={kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyStockComparison data={monthlyComparisonData} />
        </div>
        <BranchValueRank data={branchRankData} formatCurrency={formatCurrency} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <StockByLocationChart data={stockByLocation} />
        <StockByCategoryChart data={stockByCategory} />
        <AlertsPanel items={alerts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StocktakeProgressTable rows={progressRows} />
        </div>
        <TransfersSummary />
      </div>

    </div>
    </DashboardErrorBoundary>
  );
}

function KpiCards({ items }: { items: Kpi[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <span>{item.value}</span>
              {item.trend === "up" && (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              )}
              {item.trend === "down" && (
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              )}
            </div>
            {item.subValue && (
              <p className="text-xs text-muted-foreground">{item.subValue}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StockByLocationChart({ data }: { data: LocationStock[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Stock by Location</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} barSize={28}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
              formatter={(value: number, _name, props) => {
                const item = props.payload as LocationStock;
                const percent = total ? (item.value / total) * 100 : 0;
                return [
                  `${formatCurrency(value)} (${percent.toFixed(1)}%)`,
                  `Change ${item.changePct > 0 ? "+" : ""}${item.changePct.toFixed(1)}%`,
                ];
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {sorted.map((entry) => (
                <Cell key={entry.id} fill="#1E293B" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {sorted.map((item) => (
            <Link
              key={item.id}
              to={`/locations/${item.id}`}
              className="rounded-full border px-3 py-1 hover:bg-muted"
            >
              {item.name} · {formatCurrency(item.value)}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StockByCategoryChart({ data }: { data: CategoryStock[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock by Category</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={categoryColors[index % categoryColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => {
                const pct = total ? (value / total) * 100 : 0;
                return `${formatCurrency(value)} (${pct.toFixed(1)}%)`;
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function AlertsPanel({ items }: { items: AlertItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Variance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <Alert key={item.id} className="border-muted">
            <AlertTitle className="flex items-center justify-between">
              <Badge variant={item.severity === "High" ? "destructive" : "secondary"}>
                {item.severity}
              </Badge>
              <Link to={item.link} className="text-xs text-primary">
                View
              </Link>
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              {item.message}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}

function StocktakeProgressTable({ rows }: { rows: ProgressRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocktake Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.location}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell>{row.assignedTo}</TableCell>
                <TableCell>{row.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <Link to={row.action} className="text-sm text-primary">
                    {row.status === "Done" ? "View" : "Continue"}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TransfersSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfers Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Total transfer value</p>
          <p className="text-2xl font-semibold">
            {formatCurrency(transferSummary.totalValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Net transfer per location</p>
          <div className="mt-2 space-y-1 text-sm">
            {transferSummary.netByLocation.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className={item.value < 0 ? "text-rose-500" : "text-emerald-600"}>
                  {item.value < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(item.value))}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Top transfer routes</p>
          <div className="mt-2 space-y-1 text-sm">
            {transferSummary.topRoutes.map((route) => (
              <div key={`${route.from}-${route.to}`} className="flex items-center justify-between">
                <span>
                  {route.from} → {route.to}
                </span>
                <span>{formatCurrency(route.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
