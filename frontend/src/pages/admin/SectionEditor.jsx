import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sectionStatuses } from "@/data/sections";
import { useSectionsStore } from "@/stores/sectionsStore";
import { fieldClass } from "./fields";
import PlanEditor from "./PlanEditor";

const panelClass = "rounded-2xl bg-white p-5 shadow-card";

// Рядки — поверхи (згори вниз, як у будинку), стовпці — квартири на плані
const AvailabilityTable = ({ section }) => {
  const setUnitAvailable = useSectionsStore((state) => state.setUnitAvailable);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const floors = Array.from({ length: section.floors }, (_, index) => section.floors - index);

  const toggle = async (unit) => {
    setPending(unit.id);
    setError("");
    try {
      await setUnitAvailable(unit.id, !unit.available);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(null);
    }
  };

  return (
    <section className={panelClass}>
      <h3 className="text-base font-medium">Продаж квартир</h3>
      <p className="mt-1 text-sm text-slate-500">
        Натисніть на квартиру, щоб змінити її статус. Зміна зберігається одразу.
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-slate-500">Поверх</th>
              {section.apartments.map((apartment, index) => (
                <th key={apartment.id} className="min-w-24 font-medium whitespace-nowrap text-slate-700">
                  №{index + 1} · {apartment.rooms}к · {apartment.area} м²
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {floors.map((floor) => (
              <tr key={floor}>
                <th className="text-left font-medium">{floor}</th>
                {section.apartments.map((apartment) => {
                  const unit = apartment.units.find((item) => item.floor === floor);

                  return (
                    <td key={apartment.id}>
                      {unit && (
                        <button
                          type="button"
                          aria-pressed={unit.available}
                          aria-label={`${floor} поверх, ${apartment.area} м²`}
                          disabled={pending === unit.id}
                          onClick={() => toggle(unit)}
                          className={`h-9 w-full cursor-pointer rounded-md text-xs font-medium transition-colors disabled:opacity-50 ${
                            unit.available
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {unit.available ? "Продається" : "Продано"}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const SectionForm = ({ section }) => {
  const updateSection = useSectionsStore((state) => state.updateSection);
  const [status, setStatus] = useState(section.status);
  const [price, setPrice] = useState(section.price ?? "");
  const [floors, setFloors] = useState(section.floors);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const floorCount = Number(floors);
    if (
      floorCount < section.floors &&
      !window.confirm(`Видалити квартири вище ${floorCount} поверху разом з їхнім статусом?`)
    ) {
      return;
    }
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await updateSection(section.id, {
        status,
        price: price === "" ? null : Number(price),
        floors: floorCount,
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className={panelClass}>
      <h3 className="mb-4 text-base font-medium">Основна інформація</h3>

      <div className="grid items-end gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Статус
          <select
            value={status}
            onChange={(event) => {
              setSaved(false);
              setStatus(event.target.value);
            }}
            className={fieldClass}
          >
            {Object.entries(sectionStatuses).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Ціна, $/м²
          <input
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(event) => {
              setSaved(false);
              setPrice(event.target.value);
            }}
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Поверхів
          <input
            type="number"
            min="1"
            max="50"
            step="1"
            required
            value={floors}
            onChange={(event) => {
              setSaved(false);
              setFloors(event.target.value);
            }}
            className={fieldClass}
          />
        </label>

        <Button type="submit" variant="gold" size="xl" disabled={saving}>
          {saving ? "Зберігаємо..." : "Зберегти"}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-sm text-brand-dark">Збережено</p>}
    </form>
  );
};

const SectionEditor = ({ section, onBack }) => {
  const [planDirty, setPlanDirty] = useState(false);

  const back = () => {
    if (!planDirty || window.confirm("Зміни плану не збережено. Вийти без збереження?")) onBack();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="lg" onClick={back}>
          <ArrowLeft /> До секцій
        </Button>
        <h2 className="text-xl font-bold">Секція №{section.id}</h2>
      </div>

      <SectionForm section={section} />
      <PlanEditor section={section} onDirtyChange={setPlanDirty} className={panelClass} />
      {section.apartments.length > 0 && <AvailabilityTable section={section} />}
    </div>
  );
};

export default SectionEditor;
