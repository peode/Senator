import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, sectionStatuses } from "@/data/sections";
import { createComplexScene } from "@/lib/complexScene";
import { mapPointer, mapTooltipClass, mapTooltipStyle } from "@/lib/mapClasses";
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

const ComplexModel = ({ sections, map }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const sectionsRef = useRef(sections);
  const [hoveredId, setHoveredId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [activeFloor, setActiveFloor] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, width: 0, height: 0 });

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
