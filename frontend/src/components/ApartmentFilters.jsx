import { Button } from "@/components/ui/button";
import { hasActiveFilters, useApartmentFiltersStore } from "@/stores/apartmentFiltersStore";

const roomOptions = [
  { value: null, label: "Усі" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

const inputClass =
  "w-24 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-3 focus:ring-brand/20";

const ApartmentFilters = () => {
  const filters = useApartmentFiltersStore();
  const { rooms, areaFrom, areaTo, setFilters, resetFilters } = filters;

  return (
    <div className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-4 rounded-md bg-surface p-5 text-ink">
      <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Кімнат
        <div className="flex gap-2">
          {roomOptions.map(({ value, label }) => (
            <button
              key={label}
              type="button"
              aria-pressed={rooms === value}
              onClick={() => setFilters({ rooms: value })}
              className={`h-9 min-w-9 cursor-pointer rounded-full px-3 text-sm font-medium transition-colors ${
                rooms === value ? "bg-ink text-white" : "bg-white text-slate-700 hover:text-brand-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Площа від, м²
        <input
          type="number"
          min="0"
          value={areaFrom}
          onChange={(event) => setFilters({ areaFrom: event.target.value })}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
        Площа до, м²
        <input
          type="number"
          min="0"
          value={areaTo}
          onChange={(event) => setFilters({ areaTo: event.target.value })}
          className={inputClass}
        />
      </label>

      {hasActiveFilters(filters) && (
        <Button variant="outline" onClick={resetFilters}>
          Скинути
        </Button>
      )}
    </div>
  );
};

export default ApartmentFilters;
