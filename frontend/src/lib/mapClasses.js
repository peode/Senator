import { cn } from "@/lib/utils";

// Спільні стилі інтерактивних карт: карта ЖК і плани секцій
export const mapClass = "relative w-full touch-pan-y overflow-hidden";

export const mapImageClass = "block h-auto w-full select-none";

export const mapSvgClass = "absolute inset-0 size-full";

export const mapTooltipClass =
  "pointer-events-none absolute z-5 flex min-w-40 translate-4.5 flex-col gap-1.5 rounded-md bg-ink/94 px-3 py-2.5 leading-[1.3] text-white shadow-tooltip md:min-w-[190px] md:px-4 md:py-3 [&_p]:text-[13px] [&_p]:text-white/85 [&_strong]:text-base";

export const mapZoneClass = ({ active = false, dimmed = false, disabled = false, sold = false }) =>
  cn(
    "cursor-pointer fill-transparent stroke-transparent stroke-3 transition-[fill,stroke] duration-200",
    active && "fill-white/50 stroke-white",
    dimmed && "fill-black/45",
    disabled && "pointer-events-none",
    sold && active && "fill-slate-400/75 stroke-slate-300",
  );
