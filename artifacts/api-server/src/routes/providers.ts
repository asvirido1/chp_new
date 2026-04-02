import { Router } from "express";

const router = Router();

const PROVIDER_CATALOG = [
  {
    id: "delivery",
    label: "Доставка",
    providers: [
      { id: "samokat", name: "samokat", label: "Самокат", category: "delivery" },
      { id: "yandex_eda", name: "yandex_eda", label: "Яндекс Еда", category: "delivery" },
      { id: "vkusvill", name: "vkusvill", label: "ВкусВилл", category: "delivery" },
      { id: "kuper", name: "kuper", label: "Купер", category: "delivery" },
      { id: "ozon_fresh", name: "ozon_fresh", label: "Ozon Fresh", category: "delivery" },
      { id: "magnit_dostavka", name: "magnit_dostavka", label: "Магнит Доставка", category: "delivery" },
      { id: "pyaterochka", name: "pyaterochka", label: "Пятёрочка", category: "delivery" },
      { id: "perekrestok", name: "perekrestok", label: "Перекрёсток", category: "delivery" },
      { id: "lenta", name: "lenta", label: "Лента", category: "delivery" },
      { id: "delivery_other", name: "delivery_other", label: "Другое", category: "delivery" },
      { id: "delivery_unknown", name: "delivery_unknown", label: "Неизвестно", category: "delivery" },
    ],
  },
  {
    id: "micromobility",
    label: "Микромобильность",
    providers: [
      { id: "whoosh", name: "whoosh", label: "Whoosh", category: "micromobility" },
      { id: "mts_urent", name: "mts_urent", label: "МТС Юрент", category: "micromobility" },
      { id: "yandex_go", name: "yandex_go", label: "Яндекс GO (самокат)", category: "micromobility" },
      { id: "private_sim", name: "private_sim", label: "Частный самокат", category: "micromobility" },
      { id: "micromobility_other", name: "micromobility_other", label: "Другое", category: "micromobility" },
      { id: "micromobility_unknown", name: "micromobility_unknown", label: "Неизвестно", category: "micromobility" },
    ],
  },
  {
    id: "carsharing",
    label: "Каршеринг",
    providers: [
      { id: "delimobil", name: "delimobil", label: "Делимобиль", category: "carsharing" },
      { id: "citydrive", name: "citydrive", label: "СityDrive", category: "carsharing" },
      { id: "yandex_drive", name: "yandex_drive", label: "Яндекс Драйв", category: "carsharing" },
      { id: "belkacar", name: "belkacar", label: "BelkaCar", category: "carsharing" },
      { id: "carsharing_other", name: "carsharing_other", label: "Другое", category: "carsharing" },
      { id: "carsharing_unknown", name: "carsharing_unknown", label: "Неизвестно", category: "carsharing" },
    ],
  },
  {
    id: "taxi",
    label: "Такси",
    providers: [
      { id: "yandex_taxi", name: "yandex_taxi", label: "Яндекс Такси", category: "taxi" },
      { id: "uber", name: "uber", label: "Uber", category: "taxi" },
      { id: "maxim", name: "maxim", label: "Максим", category: "taxi" },
      { id: "drivee", name: "drivee", label: "Drivee", category: "taxi" },
      { id: "taxi_other", name: "taxi_other", label: "Другое", category: "taxi" },
      { id: "taxi_unknown", name: "taxi_unknown", label: "Неизвестно", category: "taxi" },
    ],
  },
  {
    id: "car",
    label: "Автомобиль",
    providers: [
      { id: "private_car", name: "private_car", label: "Частный автомобиль", category: "car" },
      { id: "service_car", name: "service_car", label: "Служебный автомобиль", category: "car" },
      { id: "municipal_car", name: "municipal_car", label: "Муниципальный автомобиль", category: "car" },
      { id: "car_unknown", name: "car_unknown", label: "Неизвестно", category: "car" },
    ],
  },
  {
    id: "other",
    label: "Другое",
    providers: [
      { id: "other_other", name: "other_other", label: "Другое", category: "other" },
      { id: "other_unknown", name: "other_unknown", label: "Неизвестно", category: "other" },
    ],
  },
];

const PROVIDER_MAP = new Map<string, { id: string; label: string; category: string }>();
for (const cat of PROVIDER_CATALOG) {
  for (const p of cat.providers) {
    PROVIDER_MAP.set(p.id, p);
  }
}

export { PROVIDER_MAP, PROVIDER_CATALOG };

router.get("/providers", (_req, res) => {
  res.json({ categories: PROVIDER_CATALOG });
});

export default router;
