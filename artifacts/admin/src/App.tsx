import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { setAdminSecretGetter } from "@workspace/api-client-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/layout/admin-layout";
import DashboardPage from "@/pages/dashboard";
import ReportsPage from "@/pages/reports";
import ReportDetailPage from "@/pages/reports/[id]";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const ADMIN_SECRET_STORAGE_KEY = "chpok.admin.secret";

function isAdminGuardEnabled() {
  return import.meta.env.VITE_ADMIN_GUARD_ENABLED === "true";
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (!isAdminGuardEnabled()) {
      return true;
    }

    const stored = window.sessionStorage.getItem(ADMIN_SECRET_STORAGE_KEY);
    if (!stored) {
      return false;
    }

    setAdminSecretGetter(() => stored);
    return true;
  });

  const title = useMemo(
    () => import.meta.env.VITE_ADMIN_GUARD_TITLE || "CHPOK Admin",
    [],
  );

  const handleUnlock = async () => {
    const trimmed = secret.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        headers: {
          "x-admin-secret": trimmed,
        },
      });

      if (!response.ok) {
        setError("Неверный секрет или доступ не разрешён");
        return;
      }

      window.sessionStorage.setItem(ADMIN_SECRET_STORAGE_KEY, trimmed);
      setAdminSecretGetter(() => trimmed);
      setIsUnlocked(true);
      setSecret("");
      queryClient.clear();
    } catch {
      setError("Не удалось проверить доступ к админке");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ADMIN_SECRET_STORAGE_KEY);
    setAdminSecretGetter(null);
    queryClient.clear();
    setIsUnlocked(false);
    setSecret("");
    setError(null);
  };

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Введите staging/dev секрет, чтобы открыть админку.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleUnlock();
                }
              }}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              className="w-full"
              onClick={() => {
                void handleUnlock();
              }}
              disabled={!secret.trim() || isSubmitting}
            >
              {isSubmitting ? "Проверяю..." : "Открыть админку"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
      {children}
    </>
  );
}

function Router() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/reports/:id" component={ReportDetailPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AdminGate>
            <Router />
          </AdminGate>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
