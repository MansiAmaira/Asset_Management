import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStatistics, fetchAssetsByType } from "@/store/slices/dashboardSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Archive,
  Wrench
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
}) => (
  <Card className="hover-elevate">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`w-8 h-8 rounded-md ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {value.toLocaleString()}
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { statistics, assetsByType, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStatistics());
    dispatch(fetchAssetsByType());
  }, [dispatch]);

  const chartData = assetsByType 
    ? Object.entries(assetsByType).map(([type, count]) => ({
        type,
        count,
      }))
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your asset management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Assets" 
          value={statistics?.total || 0} 
          icon={Package} 
          color="bg-primary" 
        />
        <StatCard 
          title="Available" 
          value={statistics?.available || 0} 
          icon={CheckCircle} 
          color="bg-chart-2" 
        />
        <StatCard 
          title="Assigned" 
          value={statistics?.assigned || 0} 
          icon={AlertCircle} 
          color="bg-chart-4" 
        />
        <StatCard 
          title="Under Repair" 
          value={statistics?.underRepair || 0} 
          icon={Wrench} 
          color="bg-chart-3" 
        />
        <StatCard 
          title="Retired" 
          value={statistics?.retired || 0} 
          icon={XCircle} 
          color="bg-destructive" 
        />
        <StatCard 
          title="Spare Assets" 
          value={statistics?.spare || 0} 
          icon={Archive} 
          color="bg-chart-5" 
        />
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assets by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="type" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
