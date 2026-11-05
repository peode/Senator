import { cn } from "@/lib/utils";

// Спільні стилі інтерактивних карт: карта ЖК і плани секцій.
// touch-manipulation лишає масштабування двома пальцями: підписи на планах дрібні
export const mapClass = "relative w-full touch-manipulation overflow-hidden";

export const mapImageClass = "block h-auto w-full select-none";

export const mapSvgClass = "absolute inset-0 size-full";

export const mapTooltipClass =
  "pointer-events-none absolute z-5 flex w-max max-w-[calc(50%-18px)] flex-col gap-1.5 rounded-md bg-ink/94 px-3 py-2.5 leading-[1.3] text-white shadow-tooltip md:min-w-[190px] md:px-4 md:py-3 [&_p]:text-[13px] [&_p]:text-white/85 [&_strong]:text-base";

// Карта обрізає все за своїми межами, тому підказка відкривається туди, де більше місця
export const mapPointer = (event, element) => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: event.clientX - left, y: event.clientY - top, width, height };
};

export const mapPolygonCenter = (points) => {
  const [x, y] = points.reduce(
    ([sumX, sumY], [pointX, pointY]) => [sumX + pointX, sumY + pointY],
    [0, 0],
  );

  return { x: x / points.length, y: y / points.length };
};

export const mapContainedPoint = (point, plan, viewport) => {
  const scale = Math.min(viewport.width / plan.width, viewport.height / plan.height);
  const offsetX = (viewport.width - plan.width * scale) / 2;
  const offsetY = (viewport.height - plan.height * scale) / 2;

  return {
    x: ((offsetX + point.x * scale) / viewport.width) * 100,
    y: ((offsetY + point.y * scale) / viewport.height) * 100,
  };
};

export const mapTooltipStyle = ({ x, y, width, height }) => ({
  left: x,
  top: y,
  transform: `translate(${x > width / 2 ? "calc(-100% - 18px)" : "18px"}, ${
    y > height / 2 ? "calc(-100% - 18px)" : "18px"
  })`,
});

export const mapZoneClass = ({ active = false, tint, clickable = true, disabled = false, sold = false }) =>
  cn(
    "fill-transparent stroke-transparent stroke-2 transition-[fill,stroke] duration-200 outline-none [vector-effect:non-scaling-stroke] focus-visible:stroke-white focus-visible:stroke-4",
    clickable ? "cursor-pointer" : "cursor-default",
    tint,
    active && "fill-white/50 stroke-white",
    disabled && "pointer-events-none",
    sold && active && "fill-slate-400/75 stroke-slate-300",
  );
