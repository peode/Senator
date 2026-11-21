import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Undo2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readImage } from "@/lib/readImage";
import { cn } from "@/lib/utils";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useComplexMap } from "@/stores/siteImagesStore";
import PlanCanvas from "./PlanCanvas";

const MAP_MAX_WIDTH = 2000;

const panelClass = "rounded-2xl bg-white p-5 shadow-card";

const toZones = (sections) =>
  Object.fromEntries(
    sections.filter(({ mapPoints }) => mapPoints).map(({ id, mapPoints }) => [id, mapPoints]),
  );

// Чернетка: на сайт і в базу потрапляє лише після «Зберегти карту»
const ComplexMapEditor = ({ sections, onBack }) => {
  const savedMap = useComplexMap();
  const saveMap = useSectionsStore((state) => state.saveMap);
  const [map, setMap] = useState(savedMap);
  const [image, setImage] = useState(null);
  const [zones, setZones] = useState(() => toZones(sections));
  const [dirty, setDirty] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // секція, яку зараз обводять, і точки її контуру
  const [drawingId, setDrawingId] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!dirty) return undefined;

    const warn = (event) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const touch = () => {
    setDirty(true);
    setSaved(false);
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    try {
      const { src, width, height } = await readImage(file, MAP_MAX_WIDTH);
      // контури масштабуємо: якщо вид той самий, їх лишиться лише підправити
      const scale = ([x, y]) => [Math.round((x / map.width) * width), Math.round((y / map.height) * height)];
      setZones((current) =>
        Object.fromEntries(Object.entries(current).map(([id, points]) => [id, points.map(scale)])),
      );
      setMap({ src, width, height });
      setImage(src);
      setSelectedId(null);
      touch();
    } catch (err) {
      setError(err.message);
    }
  };

  const startDrawing = (id) => {
    setSelectedId(null);
    setDrawingId(id);
    setDrawing([]);
  };

  const stopDrawing = () => {
    setDrawingId(null);
    setDrawing(null);
  };

  const closePath = () => {
    setZones((current) => ({ ...current, [drawingId]: drawing }));
    setSelectedId(drawingId);
    stopDrawing();
    touch();
  };

  const movePoint = (index, point) => {
    setZones((current) => ({
      ...current,
      [selectedId]: current[selectedId].toSpliced(index, 1, point),
    }));
    touch();
  };

  const removeZone = (id) => {
    setZones(({ [id]: _removed, ...rest }) => rest);
    setSelectedId(null);
    touch();
  };

  const removeAll = () => {
    if (!window.confirm("Прибрати контури всіх секцій?")) return;
    setZones({});
    setSelectedId(null);
    touch();
  };

  const selectSection = (id) => (zones[id] ? setSelectedId(id) : startDrawing(id));

  const back = () => {
    if (!dirty || window.confirm("Зміни карти не збережено. Вийти без збереження?")) onBack();
  };

  const reset = () => {
    setMap(savedMap);
    setImage(null);
    setZones(toZones(sections));
    setSelectedId(null);
    stopDrawing();
    setDirty(false);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveMap({
        map: image ? { image, width: map.width, height: map.height } : undefined,
        zones: Object.entries(zones).map(([id, points]) => ({ id: Number(id), points })),
      });
      setImage(null);
      setDirty(false);
      setSaved(true);
      setSelectedId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const canvasZones = sections
    .filter(({ id }) => zones[id])
    .map(({ id }) => ({ id, label: id, points: zones[id] }));
  const missing = sections.filter(({ id }) => !zones[id]).map(({ id }) => `№${id}`);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button variant="ghost" size="lg" onClick={back}>
          <ArrowLeft /> До секцій
        </Button>
      </div>

      <form onSubmit={submit} className={panelClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-medium">Карта ЖК</h2>

          <div className="flex flex-wrap gap-2">
            {drawing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="px-3"
                  disabled={drawing.length === 0}
                  onClick={() => setDrawing(drawing.slice(0, -1))}
                >
                  <Undo2 /> Прибрати точку
                </Button>
                <Button type="button" variant="outline" size="lg" className="px-3" onClick={stopDrawing}>
                  Скасувати контур
                </Button>
              </>
            ) : (
              <>
                <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-3 text-sm font-medium hover:border-brand">
                  <Upload size={16} /> Завантажити нову картинку
                  <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                </label>
                {canvasZones.length > 0 && (
                  <Button type="button" variant="outline" size="lg" className="px-3" onClick={removeAll}>
                    <Trash2 /> Прибрати всі контури
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {image && (
          <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Це нова картинка, контури секцій перенесено на неї пропорційно. Перевірте, чи вони збігаються з
            будинками, і обведіть заново ті, що не збігаються. Стара карта зникне лише після збереження.
          </p>
        )}

        {drawing ? (
          <p className="mb-3 rounded-lg bg-surface px-3 py-2 text-sm text-slate-700">
            Секція №{drawingId}: клікайте по кутах будинку. Щоб закрити фігуру, натисніть на першу, червону точку.
          </p>
        ) : (
          <p className="mb-3 text-sm text-slate-500">
            Натисніть на номер секції нижче: необведену можна обвести, а в обведеної — посунути точки контуру.
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {sections.map(({ id }) => (
            <button
              key={id}
              type="button"
              disabled={Boolean(drawing)}
              aria-pressed={id === (drawingId ?? selectedId)}
              onClick={() => selectSection(id)}
              className={cn(
                "h-10 min-w-12 cursor-pointer rounded-lg border px-2 text-sm font-semibold transition-colors disabled:cursor-default",
                id === (drawingId ?? selectedId)
                  ? "border-ink bg-gold text-ink"
                  : zones[id]
                    ? "border-brand bg-brand/15 text-ink hover:bg-brand/30"
                    : "border-dashed border-neutral-400 bg-white text-slate-500 hover:border-brand",
              )}
            >
              №{id}
            </button>
          ))}
        </div>

        {selectedId !== null && !drawing && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Секція №{selectedId}:</span>
            <Button type="button" variant="outline" size="lg" className="px-3" onClick={() => startDrawing(selectedId)}>
              <Pencil /> Обвести заново
            </Button>
            <Button type="button" variant="outline" size="lg" className="px-3" onClick={() => removeZone(selectedId)}>
              <Trash2 /> Прибрати контур
            </Button>
          </div>
        )}

        <PlanCanvas
          plan={map}
          alt="Карта ЖК"
          zoneName="Секція"
          zones={canvasZones}
          selectedId={selectedId}
          drawing={drawing}
          onSelect={setSelectedId}
          onAddPoint={(point) => setDrawing([...drawing, point])}
          onClosePath={closePath}
          onMovePoint={movePoint}
        />

        {missing.length > 0 && (
          <p className="mt-3 text-sm text-slate-600">
            Не обведено, тому не буде на карті: {missing.join(", ")}.
          </p>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {saved && <p className="mt-3 text-sm text-brand-dark">Карту збережено</p>}

        {dirty && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button type="submit" variant="gold" size="xl" disabled={saving || Boolean(drawing)}>
              {saving ? "Зберігаємо..." : "Зберегти карту"}
            </Button>
            <Button type="button" variant="ghost" size="xl" disabled={saving} onClick={reset}>
              Скасувати зміни
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ComplexMapEditor;
