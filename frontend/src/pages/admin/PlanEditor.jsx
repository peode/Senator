import { useEffect, useState } from "react";
import { Plus, Trash2, Undo2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readImage } from "@/lib/readImage";
import { cn } from "@/lib/utils";
import { useSectionsStore } from "@/stores/sectionsStore";
import { fieldClass } from "./fields";
import PlanCanvas from "./PlanCanvas";

// Чернетка: на сайт і в базу потрапляє лише після «Зберегти план»
const toDraft = ({ plan, apartments }) => ({
  plan,
  image: null,
  apartments: apartments.map(({ id, rooms, area, points }) => ({ id, rooms, area, points })),
});

const ApartmentRow = ({ apartment, number, selected, onSelect, onChange, onDelete }) => (
  <li
    className={cn(
      "flex flex-wrap items-end gap-3 rounded-lg border p-3 transition-colors",
      selected ? "border-gold bg-gold/10" : "border-neutral-200",
    )}
    onFocus={onSelect}
    onClick={onSelect}
  >
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
      {number}
    </span>

    <label className="flex w-24 flex-col gap-1 text-sm font-medium text-slate-700">
      Кімнат
      <input
        type="number"
        min="1"
        max="20"
        step="1"
        required
        autoFocus={apartment.rooms === ""}
        value={apartment.rooms}
        onChange={(event) => onChange({ rooms: event.target.value })}
        className={fieldClass}
      />
    </label>

    <label className="flex w-32 flex-col gap-1 text-sm font-medium text-slate-700">
      Площа, м²
      <input
        type="number"
        min="0.01"
        max="10000"
        step="0.01"
        required
        value={apartment.area}
        onChange={(event) => onChange({ area: event.target.value })}
        className={fieldClass}
      />
    </label>

    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className="ml-auto"
      aria-label={`Видалити квартиру ${number}`}
      onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}
    >
      <Trash2 />
    </Button>
  </li>
);

const PlanEditor = ({ section, onDirtyChange, className }) => {
  const savePlan = useSectionsStore((state) => state.savePlan);
  const [draft, setDraft] = useState(() => toDraft(section));
  const [dirty, setDirty] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // точки контуру, який зараз малюють; null — малювання вимкнене
  const [drawing, setDrawing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onDirtyChange(dirty);
    if (!dirty) return undefined;

    const warn = (event) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, onDirtyChange]);

  const changeApartments = (update) => {
    setDraft((current) => ({ ...current, apartments: update(current.apartments) }));
    setDirty(true);
    setSaved(false);
  };

  const changeApartment = (id, patch) =>
    changeApartments((apartments) =>
      apartments.map((apartment) => (apartment.id === id ? { ...apartment, ...patch } : apartment)),
    );

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    try {
      const { src, width, height } = await readImage(file);
      // старі контури не збігаються з новим зображенням: квартири обводяться заново
      setDraft({ plan: { src, width, height }, image: src, apartments: [] });
      setSelectedId(null);
      setDrawing([]);
      setDirty(true);
      setSaved(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const closePath = () => {
    const id = crypto.randomUUID();
    changeApartments((apartments) => [...apartments, { id, rooms: "", area: "", points: drawing }]);
    setDrawing(null);
    setSelectedId(id);
  };

  const movePoint = (index, point) => {
    const { points } = draft.apartments.find((apartment) => apartment.id === selectedId);
    changeApartment(selectedId, { points: points.toSpliced(index, 1, point) });
  };

  const deleteApartment = (id) => {
    changeApartments((apartments) => apartments.filter((apartment) => apartment.id !== id));
    setSelectedId(null);
  };

  const reset = () => {
    setDraft(toDraft(section));
    setDirty(false);
    setSelectedId(null);
    setDrawing(null);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const removed = section.apartments.filter(
      ({ id }) => !draft.apartments.some((apartment) => apartment.id === id),
    ).length;
    if (
      removed > 0 &&
      !window.confirm(`Буде видалено квартир: ${removed}, разом з їхнім статусом продажу. Продовжити?`)
    ) {
      return;
    }

    setSaving(true);
    setError("");
    try {
      const { plan, image, apartments } = draft;
      const updated = await savePlan(section.id, {
        plan: image ? { image, width: plan.width, height: plan.height } : undefined,
        apartments: apartments.map(({ rooms, area, ...apartment }) => ({
          ...apartment,
          rooms: Number(rooms),
          area: Number(area),
        })),
      });
      setDraft(toDraft(updated));
      setDirty(false);
      setSaved(true);
      setSelectedId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const { plan, apartments } = draft;

  return (
    <form onSubmit={submit} className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-medium">План секції</h3>

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
              <Button type="button" variant="outline" size="lg" className="px-3" onClick={() => setDrawing(null)}>
                Скасувати контур
              </Button>
            </>
          ) : (
            <>
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-3 text-sm font-medium hover:border-brand">
                <Upload size={16} /> {plan ? "Змінити план" : "Завантажити план"}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
              {plan && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="px-3"
                  onClick={() => {
                    setSelectedId(null);
                    setDrawing([]);
                  }}
                >
                  <Plus /> Обвести квартиру
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {draft.image && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Це новий план: обведіть на ньому квартири й збережіть. Старий план і його квартири зникнуть лише після збереження.
        </p>
      )}

      {drawing && (
        <p className="mb-3 rounded-lg bg-surface px-3 py-2 text-sm text-slate-700">
          Клікайте по кутах квартири. Щоб закрити фігуру, натисніть на першу, червону точку.
        </p>
      )}

      {plan ? (
        <PlanCanvas
          plan={plan}
          apartments={apartments}
          selectedId={selectedId}
          drawing={drawing}
          onSelect={setSelectedId}
          onAddPoint={(point) => setDrawing([...drawing, point])}
          onClosePath={closePath}
          onMovePoint={movePoint}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-16 text-center text-sm text-slate-500">
          Завантажте зображення плану, щоб обвести на ньому квартири.
        </p>
      )}

      {apartments.length > 0 && (
        <>
          <h4 className="mt-5 mb-2 text-sm font-medium text-slate-700">
            Квартири на плані: {apartments.length}
          </h4>
          {/* нові згори: одразу під планом, де щойно обвели квартиру */}
          <ul className="flex flex-col gap-2">
            {apartments
              .map((apartment, index) => (
                <ApartmentRow
                  key={apartment.id}
                  apartment={apartment}
                  number={index + 1}
                  selected={apartment.id === selectedId}
                  onSelect={() => setSelectedId(apartment.id)}
                  onChange={(patch) => changeApartment(apartment.id, patch)}
                  onDelete={() => deleteApartment(apartment.id)}
                />
              ))
              .toReversed()}
          </ul>
        </>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-sm text-brand-dark">План збережено</p>}

      {dirty && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="submit" variant="gold" size="xl" disabled={saving || Boolean(drawing)}>
            {saving ? "Зберігаємо..." : "Зберегти план"}
          </Button>
          <Button type="button" variant="ghost" size="xl" disabled={saving} onClick={reset}>
            Скасувати зміни
          </Button>
        </div>
      )}
    </form>
  );
};

export default PlanEditor;
