import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  activeFiltersCount,
  hasActiveFilters,
  useApartmentFiltersStore,
} from "@/stores/apartmentFiltersStore";

const roomOptions = [
  { value: null, label: "Усі" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

const numberFields = [
  { name: "areaFrom", label: "Площа від, м²" },
  { name: "areaTo", label: "Площа до, м²" },
  { name: "budgetTo", label: "Бюджет до, $" },
];

const inputClass =
  "w-28 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-3 focus:ring-brand/20";

const ApartmentFilters = ({ className }) => {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const filters = useApartmentFiltersStore();
  const { rooms, setFilters, resetFilters } = filters;
  const count = activeFiltersCount(filters);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className={cn("relative w-fit", className)}>
      <Button variant="outline" aria-expanded={open} onClick={() => setOpen(!open)}>
        <SlidersHorizontal size={16} /> Фільтри
        {count > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-ink text-xs text-white">
            {count}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-2 flex w-[min(640px,calc(100vw-2rem))] flex-wrap items-end gap-x-6 gap-y-4 rounded-2xl bg-white p-5 text-ink shadow-card-hover">
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
                    rooms === value ? "bg-ink text-white" : "bg-surface text-slate-700 hover:text-brand-dark"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {numberFields.map(({ name, label }) => (
            <label key={name} className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              {label}
              <input
                type="number"
                min="0"
                value={filters[name]}
                onChange={(event) => setFilters({ [name]: event.target.value })}
                className={inputClass}
              />
            </label>
          ))}

          {hasActiveFilters(filters) && (
            <Button variant="outline" onClick={resetFilters}>
              Скинути
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ApartmentFilters;
