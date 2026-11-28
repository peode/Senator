import { useEffect, useRef } from "react";

const FloorPicker = ({ floors, current, freeCount, onSelect }) => {
  const navRef = useRef(null);

  // на телефоні список прокручується вбік: обраний поверх має бути видно
  useEffect(() => {
    const nav = navRef.current;
    const button = nav.querySelector('[aria-pressed="true"]');
    nav.scrollTo({ left: button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2 });
  }, [current]);

  return (
    <nav
      ref={navRef}
      aria-label="Вибір поверху"
      className="relative flex shrink-0 gap-2 overflow-x-auto pb-1 md:max-h-[560px] md:w-32 md:flex-col md:overflow-x-visible md:overflow-y-auto md:pb-0"
    >
      {floors.map((floor) => {
        const free = freeCount(floor);

        return (
          <button
            key={floor}
            type="button"
            aria-pressed={floor === current}
            onClick={() => onSelect(floor)}
            className={`flex shrink-0 cursor-pointer flex-col items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors md:w-full md:flex-row md:justify-between md:px-3 ${
              floor === current
                ? "bg-ink text-white"
                : free > 0
                  ? "bg-surface text-ink hover:text-brand-dark"
                  : "bg-surface text-slate-600"
            }`}
          >
            <span>{floor} пов.</span>
            <span className="text-xs">{free} вільн.</span>
          </button>
        );
      })}
    </nav>
  );
};

export default FloorPicker;
