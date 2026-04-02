import { useAdminGetStats, useAdminGetReports } from "@workspace/api-client-react";
import { Link } from "wouter";
import { AlertCircle, CheckCircle, Clock, FileText, RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_LABELS: Record<string, string> = {
  new: "Новое",
  in_review: "На рассмотрении",
  confirmed: "Подтверждено",
  rejected: "Отклонено",
  resolved: "Решено",
  archived: "Архив",
};

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Доставка",
  micromobility: "Микромобильность",
  carsharing: "Каршеринг",
  taxi: "Такси",
  car: "Автомобиль",
  other: "Другое",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_review: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-orange-100 text-orange-800",
  rejected: "bg-red-100 text-red-800",
  resolved: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number | undefined;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value ?? 0}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminGetStats();
  const { data: recent } = useAdminGetReports({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });

  const reports = recent?.reports ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Дашборд</h1>
          <p className="text-sm text-muted-foreground">Сводка по обращениям Chpok</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchStats()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Всего обращений" value={stats?.totalReports} icon={FileText} loading={statsLoading} />
        <StatCard title="Новых" value={stats?.newReports} icon={AlertCircle} loading={statsLoading} />
        <StatCard title="На рассмотрении" value={stats?.inReviewReports} icon={Clock} loading={statsLoading} />
        <StatCard title="Решено" value={stats?.resolvedReports} icon={CheckCircle} loading={statsLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              По категориям
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(stats?.byCategory ?? []).map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{CATEGORY_LABELS[item.category] ?? item.category}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
                {(stats?.byCategory ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Нет данных</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">По статусам</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(stats?.byStatus ?? []).map((item) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[item.status] ?? ""}`}>
                      {STATUS_LABELS[item.status] ?? item.status}
                    </span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
                {(stats?.byStatus ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Нет данных</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Последние обращения</CardTitle>
          <Link href="/reports">
            <Button variant="ghost" size="sm" className="text-xs">
              Все обращения →
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((r) => (
              <Link key={r.id} href={`/reports/${r.id}`}>
                <div className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium truncate">{r.providerLabel}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[r.status] ?? ""}`}
                    >
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {reports.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Нет обращений</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
