import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sectionStatuses } from "@/data/sections";
import { useSections, useSectionsStore } from "@/stores/sectionsStore";
import AdminListSkeleton from "./AdminListSkeleton";
import { fieldClass } from "./fields";

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
    <div className="mt-4">
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-slate-500">Поверх</th>
              {section.apartments.map((apartment) => (
                <th key={apartment.id} className="min-w-24 font-medium whitespace-nowrap text-slate-700">
                  {apartment.rooms}к · {apartment.area} м²
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
    </div>
  );
};

const SectionRow = ({ section }) => {
  const updateSection = useSectionsStore((state) => state.updateSection);
  const [status, setStatus] = useState(section.status);
  const [price, setPrice] = useState(section.price ?? "");
  const [floors, setFloors] = useState(section.floors);
  const [tableOpen, setTableOpen] = useState(false);
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
    <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-card">
      <div className="grid items-end gap-4 md:grid-cols-[1fr_180px_120px_110px_auto]">
        <div>
          <p className="text-base font-medium">Секція №{section.id}</p>
          <p className="text-sm text-slate-500">Квартир на плані: {section.apartments.length}</p>
          {section.apartments.length > 0 && (
            <button
              type="button"
              aria-expanded={tableOpen}
              onClick={() => setTableOpen(!tableOpen)}
              className="mt-1 cursor-pointer text-sm font-semibold text-brand-dark"
            >
              {tableOpen ? "Сховати квартири" : "Продаж квартир"}
            </button>
          )}
        </div>

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
      {tableOpen && <AvailabilityTable section={section} />}
    </form>
  );
};

const SectionsAdmin = () => {
  const { sections, loading, error } = useSections();

  if (loading) return <AdminListSkeleton />;
  if (error) return <p className="text-sm text-red-600">Не вдалося завантажити секції.</p>;

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <SectionRow key={section.id} section={section} />
      ))}
    </div>
  );
};

export default SectionsAdmin;
