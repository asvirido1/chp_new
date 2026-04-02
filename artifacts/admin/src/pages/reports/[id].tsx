import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAdminGetReport, useAdminUpdateReportStatus, useAdminAddNote } from "@workspace/api-client-react";
import type { ReportStatus, StatusHistoryEntry, AdminNote } from "@workspace/api-client-react";
import { ArrowLeft, RefreshCw, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  new: "bg-blue-100 text-blue-800 border-blue-200",
  in_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-orange-100 text-orange-800 border-orange-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

const ALL_STATUSES: ReportStatus[] = [
  "new",
  "in_review",
  "confirmed",
  "rejected",
  "resolved",
  "archived",
];

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: report, isLoading, refetch } = useAdminGetReport(id);

  const updateStatus = useAdminUpdateReportStatus();
  const addNote = useAdminAddNote();

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState("");
  const [noteText, setNoteText] = useState("");

  const currentStatus = report?.status ?? "";
  const effectiveStatus = selectedStatus || currentStatus;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === currentStatus) return;
    try {
      await updateStatus.mutateAsync({
        id,
        data: {
          status: selectedStatus as ReportStatus,
          note: statusNote.trim() || null,
          adminId: null,
        },
      });
      toast({ title: "Статус обновлён", description: STATUS_LABELS[selectedStatus] });
      setSelectedStatus("");
      setStatusNote("");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось обновить статус", variant: "destructive" });
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote.mutateAsync({ id, data: { text: noteText.trim(), adminId: null } });
      toast({ title: "Заметка добавлена" });
      setNoteText("");
      refetch();
    } catch {
      toast({ title: "Ошибка", description: "Не удалось добавить заметку", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <p className="text-muted-foreground">Обращение не найдено</p>
        <Button variant="outline" onClick={() => navigate("/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к списку
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">
            Обращение #{id.slice(0, 8)}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">{id}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Детали обращения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium border ${STATUS_COLORS[report.status] ?? ""}`}>
                {STATUS_LABELS[report.status] ?? report.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Категория</span>
              <span className="font-medium">{CATEGORY_LABELS[report.category] ?? report.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Провайдер</span>
              <span className="font-medium">{report.providerLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Анонимно</span>
              <span>{report.isAnonymous ? "Да" : "Нет"}</span>
            </div>
            {report.addressText && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Адрес</span>
                <span className="text-right max-w-[60%]">{report.addressText}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Создано</span>
              <span>{new Date(report.createdAt).toLocaleString("ru-RU")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Обновлено</span>
              <span>{new Date(report.updatedAt).toLocaleString("ru-RU")}</span>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-muted-foreground mb-1">Описание</p>
              <p className="leading-relaxed">{report.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Изменить статус</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={effectiveStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Комментарий к изменению статуса (необязательно)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={2}
              />
              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === currentStatus || updateStatus.isPending}
              >
                {updateStatus.isPending ? "Сохраняю..." : "Сохранить статус"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Добавить заметку</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Внутренняя заметка модератора..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddNote}
                disabled={!noteText.trim() || addNote.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {addNote.isPending ? "Отправляю..." : "Добавить заметку"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              История статусов
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(report.statusHistory ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Изменений нет</p>
            ) : (
              <div className="space-y-3">
                {(report.statusHistory ?? []).map((h: StatusHistoryEntry) => (
                  <div key={h.id} className="text-sm border-l-2 border-border pl-3">
                    <div className="flex items-center gap-2">
                      {h.fromStatus && (
                        <span className="text-muted-foreground line-through">
                          {STATUS_LABELS[h.fromStatus] ?? h.fromStatus}
                        </span>
                      )}
                      <span>→</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[h.toStatus] ?? ""}`}>
                        {STATUS_LABELS[h.toStatus] ?? h.toStatus}
                      </span>
                    </div>
                    {h.note && <p className="text-muted-foreground mt-1">{h.note}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(h.createdAt).toLocaleString("ru-RU")}
                      {h.changedBy ? ` · ${h.changedBy}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Заметки модератора</CardTitle>
          </CardHeader>
          <CardContent>
            {(report.adminNotes ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Заметок нет</p>
            ) : (
              <div className="space-y-3">
                {(report.adminNotes ?? []).map((n: AdminNote) => (
                  <div key={n.id} className="text-sm border border-border rounded-md p-3 bg-muted/30">
                    <p>{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleString("ru-RU")}
                      {n.adminId ? ` · ${n.adminId}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
