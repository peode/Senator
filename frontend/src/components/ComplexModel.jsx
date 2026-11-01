import { useEffect, useRef, useState } from "react";
import { Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, sectionStatuses } from "@/data/sections";
import { createComplexScene } from "@/lib/complexScene";
import { mapPointer, mapTooltipClass, mapTooltipStyle } from "@/lib/mapClasses";
import { daylight, formatHour } from "@/lib/sunPath";
import { cn } from "@/lib/utils";

const freeUnits = ({ apartments }, floor) =>
  apartments
    .flatMap(({ units }) => units)
    .filter((unit) => unit.available && (floor === undefined || unit.floor === floor)).length;

const StatusLabel = ({ status }) => (
  <span className={cn("inline-flex items-center gap-[7px] text-xs font-semibold before:inline-block before:size-[9px] before:rounded-full before:bg-current", status.textClass)}>
    {status.label}
  </span>
);

const compassMarks = [
  { label: "Пн", angle: 0, className: "fill-red-600" },
  { label: "Сх", angle: 90, className: "fill-ink" },
  { label: "Пд", angle: 180, className: "fill-ink" },
  { label: "Зх", angle: 270, className: "fill-ink" },
];

const MARK_RADIUS = 20;

const markPosition = (degrees) => ({
  x: 32 + MARK_RADIUS * Math.sin((degrees * Math.PI) / 180),
  y: 32 - MARK_RADIUS * Math.cos((degrees * Math.PI) / 180),
});

// Позиції задаємо атрибутами SVG: Safari на iPhone по-своєму обертає текст через CSS-трансформації
const turnCompass = (compass, degrees) => {
  compass.querySelector("[data-needle]").setAttribute("transform", `rotate(${degrees} 32 32)`);
  compass.querySelectorAll("[data-mark]").forEach((mark) => {
    const { x, y } = markPosition(degrees + Number(mark.dataset.mark));
    mark.setAttribute("x", x);
    mark.setAttribute("y", y);
  });
};

const Compass = ({ ref }) => (
  <svg ref={ref} viewBox="0 0 64 64" role="img" aria-label="Компас: сторони світу" className="size-16 rounded-full bg-white/95 shadow-card">
    <g data-needle="">
      <path d="M32 22 35.5 32H28.5Z" className="fill-red-600" />
      <path d="M32 42 28.5 32H35.5Z" className="fill-slate-400" />
    </g>
    {compassMarks.map(({ label, angle, className }) => (
      <text
        key={label}
        data-mark={angle}
        {...markPosition(angle)}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn("text-[10px] font-bold", className)}
      >
        {label}
      </text>
    ))}
  </svg>
);

const dayLabel = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long" });

const ComplexModel = ({ sections, map }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const sectionsRef = useRef(sections);
  const compassRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [activeFloor, setActiveFloor] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [sunOpen, setSunOpen] = useState(false);
  const [hour, setHour] = useState(13);
  const [today] = useState(() => new Date());
  const { sunrise, sunset } = daylight(today);

  const find = (id) => sections.find((section) => section.id === id);
  const hovered = find(hoveredId);
  const focused = find(focusedId);

  // Сцена живе довше за рендер, тому свіжі секції читає через ref
  useEffect(() => {
    sectionsRef.current = sections;
  });

  // Форма будинків залежить лише від статусу й поверхів: інші зміни не перебудовують модель
  const layout = sections.map(({ id, status, floors }) => `${id}:${status}:${floors}`).join();

  useEffect(() => {
    const scene = createComplexScene({
      container: containerRef.current,
      sections: sectionsRef.current,
      mapSrc: map.src,
      onHover: (id, event) => {
        setHoveredId(id);
        if (event) setCursor(mapPointer(event, containerRef.current));
      },
      onFocus: (id) => {
        setFocusedId(id);
        setActiveFloor(null);
      },
      onFloorHover: setActiveFloor,
      onFloorSelect: (id, floor) => {
        const section = sectionsRef.current.find((item) => item.id === id);
        if (section?.plan) navigate(`/apartments/${id}?floor=${floor}`);
      },
      onTurn: (degrees) => compassRef.current && turnCompass(compassRef.current, degrees),
    });
    sceneRef.current = scene;

    const onKeyDown = (event) => {
      if (event.key === "Escape") scene.overview();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      scene.dispose();
      sceneRef.current = null;
      setFocusedId(null);
      setHoveredId(null);
    };
  }, [layout, map.src, navigate]);

  useEffect(() => {
    sceneRef.current?.setSun(sunOpen ? hour : null, today);
  }, [sunOpen, hour, today, layout, map.src]);

  const previewFloor = (floor) => {
    setActiveFloor(floor);
    sceneRef.current?.showFloor(floor);
  };

  const status = focused && sectionStatuses[focused.status];
  const hoveredStatus = hovered && sectionStatuses[hovered.status];
  const selling = focused?.status === "SELLING";
  const floorNumbers = focused ? Array.from({ length: focused.floors }, (_, index) => focused.floors - index) : [];

  return (
    <div className="relative h-[68svh] min-h-[440px] w-full overflow-hidden bg-[#e6edf1] md:h-[calc(100svh-120px)]">
      <div ref={containerRef} aria-label="3D-модель ЖК Senator" role="img" className="size-full [&_canvas]:block [&_canvas]:size-full" />

      <div className="pointer-events-none absolute top-3 left-3 z-4 flex w-[min(280px,calc(100%-24px))] flex-col gap-2">
        <div className="flex items-center gap-2">
          <Compass ref={compassRef} />
          <button
            type="button"
            aria-pressed={sunOpen}
            aria-label="Сонце й тіні"
            title="Сонце й тіні"
            onClick={() => setSunOpen((open) => !open)}
            className={cn(
              "pointer-events-auto flex size-11 cursor-pointer items-center justify-center rounded-full shadow-card transition-colors",
              sunOpen ? "bg-[#ffb52e] text-ink" : "bg-white/95 text-ink hover:bg-white",
            )}
          >
            <Sun aria-hidden="true" className="size-5" />
          </button>
        </div>

        {sunOpen && (
          <div className="pointer-events-auto rounded-xl bg-white/95 p-3 text-ink shadow-card">
            <label htmlFor="sun-hour" className="flex items-baseline justify-between text-sm font-semibold">
              Час доби
              <span className="text-lg font-extrabold tabular-nums">{formatHour(hour)}</span>
            </label>
            <input
              id="sun-hour"
              type="range"
              min="0"
              max="23.75"
              step="0.25"
              value={hour}
              aria-valuetext={formatHour(hour)}
              onChange={(event) => setHour(Number(event.target.value))}
              className="mt-2 h-8 w-full cursor-pointer touch-none accent-[#ffb52e]"
            />
            <p className="mt-1 text-xs text-slate-700">
              {dayLabel.format(today)}: схід {formatHour(sunrise)}, захід {formatHour(sunset)}
            </p>
          </div>
        )}
      </div>

      {hoveredStatus && (
        <div className={mapTooltipClass} style={mapTooltipStyle(cursor)}>
          <strong>Секція №{hovered.id}</strong>
          <StatusLabel status={hoveredStatus} />
          {hovered.status === "SELLING" && (
            <p>
              від {formatPrice(hovered.price)} $/м²
              <br />
              вільних квартир: {freeUnits(hovered)}
            </p>
          )}
        </div>
      )}

      {focused && (
        <aside
          aria-live="polite"
          className="absolute inset-x-2 bottom-2 z-5 flex max-h-[52%] flex-col gap-2 overflow-y-auto rounded-xl bg-white p-3 text-ink shadow-card md:inset-x-auto md:top-3 md:right-3 md:bottom-3 md:max-h-none md:w-[252px] md:gap-3 md:p-4"
        >
          <button
            type="button"
            onClick={() => sceneRef.current?.overview()}
            className="min-h-9 cursor-pointer self-start text-sm font-semibold text-brand-dark"
          >
            ← Усі секції
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl leading-tight font-extrabold">Секція №{focused.id}</h2>
            <StatusLabel status={status} />
          </div>
          {selling && (
            <p className="text-[13px] text-slate-700">
              від {formatPrice(focused.price)} $/м², вільних квартир: {freeUnits(focused)}
            </p>
          )}

          {focused.plan ? (
            <>
              <h3 className="text-sm font-semibold">Оберіть поверх</h3>
              <div className="grid grid-cols-6 gap-1.5 md:grid-cols-4">
                {floorNumbers.map((floor) => (
                  <Link
                    key={floor}
                    to={`/apartments/${focused.id}?floor=${floor}`}
                    aria-label={`${floor} поверх`}
                    onPointerEnter={() => previewFloor(floor)}
                    onPointerLeave={() => previewFloor(null)}
                    onFocus={() => previewFloor(floor)}
                    onBlur={() => previewFloor(null)}
                    className={cn(
                      "relative flex h-11 items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold tabular-nums transition-colors hover:border-brand-dark",
                      activeFloor === floor && "border-brand-dark bg-brand/15",
                    )}
                  >
                    {floor}
                    {selling && freeUnits(focused, floor) > 0 && (
                      <span className="absolute top-1 right-1 size-1.5 rounded-full bg-status-selling-strong" />
                    )}
                  </Link>
                ))}
              </div>
              {selling && (
                <span className="flex items-center gap-1.5 text-xs text-slate-700">
                  <span className="size-1.5 rounded-full bg-status-selling-strong" />є вільні квартири
                </span>
              )}
            </>
          ) : (
            <p className="text-[13px] text-slate-700">Планування цієї секції поки що недоступне.</p>
          )}
        </aside>
      )}
    </div>
  );
};

export default ComplexModel;
