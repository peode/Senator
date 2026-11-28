// Контур на карті: працює і мишею, і пальцем, і з клавіатури.
// Без onSelect це лише підказка: у порядок Tab такий контур не потрапляє
const MapZone = ({ label, points, pressed, className, onSelect, onPreview, onPreviewEnd }) => (
  <polygon
    className={className}
    points={points.map((point) => point.join(",")).join(" ")}
    role={onSelect ? "button" : undefined}
    tabIndex={onSelect ? 0 : undefined}
    aria-label={onSelect ? label : undefined}
    aria-pressed={pressed}
    onPointerEnter={onPreview}
    onPointerDown={onPreview}
    onPointerLeave={onPreviewEnd}
    onFocus={(event) => {
      if (!event.currentTarget.matches(":focus-visible")) return;

      const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
      onPreview({ clientX: left + width / 2, clientY: top + height / 2 });
    }}
    onBlur={onPreviewEnd}
    onClick={onSelect}
    onKeyDown={(event) => {
      if (onSelect && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onSelect();
      }
    }}
  />
);

export default MapZone;
