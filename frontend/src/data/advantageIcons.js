import {
  Baby,
  CarFront,
  Flame,
  KeyRound,
  LayoutPanelTop,
  MapPin,
  ShieldCheck,
  Siren,
  Sparkles,
  Store,
  Trees,
  Wifi,
} from "lucide-react";

// У базі зберігається ключ, а не компонент іконки
export const advantageIcons = {
  shield: { label: "Щит", icon: ShieldCheck },
  flame: { label: "Вогонь", icon: Flame },
  car: { label: "Автомобіль", icon: CarFront },
  layout: { label: "Планування", icon: LayoutPanelTop },
  siren: { label: "Укриття", icon: Siren },
  store: { label: "Магазин", icon: Store },
  trees: { label: "Дерева", icon: Trees },
  baby: { label: "Діти", icon: Baby },
  mapPin: { label: "Локація", icon: MapPin },
  key: { label: "Ключ", icon: KeyRound },
  wifi: { label: "Інтернет", icon: Wifi },
  sparkles: { label: "Зірочки", icon: Sparkles },
};
