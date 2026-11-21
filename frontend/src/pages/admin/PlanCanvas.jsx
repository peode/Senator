import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const toPoints = (points) => points.map((point) => point.join(",")).join(" ");

// Центр контуру: тут стоїть номер квартири
const centerOf = (points) =>
  [0, 1].map((axis) => points.reduce((sum, point) => sum + point[axis], 0) / points.length);

// Контури малюються в SVG у координатах плану, а точки й номери — окремими елементами
// поверх нього: так вони не змінюють розмір разом із зображенням
const PlanCanvas = ({
  plan,
  alt = "План секції",
  zoneName = "Квартира",
  zones,
  selectedId,
  drawing,
  onSelect,
  onAddPoint,
  onClosePath,
  onMovePoint,
}) => {
  const canvasRef = useRef(null);
  const [cursor, setCursor] = useState(null);
  const selected = zones.find((zone) => zone.id === selectedId);

  const toPlanPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = (offset, size, planSize) =>
      Math.round(Math.min(Math.max(offset / size, 0), 1) * planSize);

    return [
      scale(event.clientX - rect.left, rect.width, plan.width),
      scale(event.clientY - rect.top, rect.height, plan.height),
    ];
  };

  const place = ([x, y]) => ({ left: `${(x / plan.width) * 100}%`, top: `${(y / plan.height) * 100}%` });

  return (
    <div
      ref={canvasRef}
      className={cn("relative w-full select-none overflow-hidden rounded-lg", drawing && "cursor-crosshair")}
      onPointerMove={(event) => drawing && setCursor(toPlanPoint(event))}
      onPointerLeave={() => setCursor(null)}
      onClick={(event) => (drawing ? onAddPoint(toPlanPoint(event)) : onSelect(null))}
    >
      <img
        src={plan.src}
        alt={alt}
        width={plan.width}
        height={plan.height}
        className="block h-auto w-full"
        draggable="false"
      />

      <svg className="absolute inset-0 size-full" viewBox={`0 0 ${plan.width} ${plan.height}`}>
        {zones.map((zone, index) => (
          <polygon
            key={zone.id}
            aria-label={`${zoneName} ${zone.label ?? index + 1}`}
            points={toPoints(zone.points)}
            className={cn(
              "cursor-pointer stroke-2 transition-[fill] [vector-effect:non-scaling-stroke]",
              zone.id === selectedId
                ? "fill-gold/45 stroke-ink"
                : "fill-brand/20 stroke-brand-dark hover:fill-brand/40",
              drawing && "pointer-events-none",
            )}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(zone.id);
            }}
          />
        ))}

        {drawing && (
          <polyline
            points={toPoints(cursor ? [...drawing, cursor] : drawing)}
            className="pointer-events-none fill-gold/25 stroke-ink stroke-2 [vector-effect:non-scaling-stroke]"
          />
        )}
      </svg>

      {zones.map((zone, index) => (
        <span
          key={zone.id}
          style={place(centerOf(zone.points))}
          className="pointer-events-none absolute flex size-6 -translate-1/2 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white"
        >
          {zone.label ?? index + 1}
        </span>
      ))}

      {selected &&
        !drawing &&
        selected.points.map((point, index) => (
          <span
            key={index}
            style={place(point)}
            title="Перетягніть, щоб посунути точку"
            className="absolute size-3.5 -translate-1/2 cursor-move touch-none rounded-full border-2 border-ink bg-white"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                onMovePoint(index, toPlanPoint(event));
              }
            }}
          />
        ))}

      {drawing?.map((point, index) =>
        index === 0 ? (
          <button
            key={index}
            type="button"
            aria-label="Закрити контур"
            style={place(point)}
            disabled={drawing.length < 3}
            className={cn(
              "absolute size-5 -translate-1/2 rounded-full border-2 border-white bg-red-600 enabled:cursor-pointer enabled:hover:scale-150",
              drawing.length < 3 && "pointer-events-none",
            )}
            onClick={(event) => {
              event.stopPropagation();
              onClosePath();
            }}
          />
        ) : (
          <span
            key={index}
            style={place(point)}
            className="pointer-events-none absolute size-2.5 -translate-1/2 rounded-full border-2 border-white bg-ink"
          />
        ),
      )}
    </div>
  );
};

export default PlanCanvas;
