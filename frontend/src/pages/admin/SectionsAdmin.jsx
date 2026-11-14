import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sectionStatuses } from "@/data/sections";
import { useSections, useSectionsStore } from "@/stores/sectionsStore";
import AdminListSkeleton from "./AdminListSkeleton";
import { fieldClass } from "./fields";

const SectionRow = ({ section }) => {
  const updateSection = useSectionsStore((state) => state.updateSection);
  const [status, setStatus] = useState(section.status);
  const [price, setPrice] = useState(section.price ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await updateSection(section.id, { status, price: price === "" ? null : Number(price) });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-card">
      <div className="grid items-end gap-4 md:grid-cols-[1fr_200px_160px_auto]">
        <div>
          <p className="text-base font-medium">Секція №{section.id}</p>
          <p className="text-sm text-slate-500">Квартир на плані: {section.apartments.length}</p>
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

        <Button type="submit" variant="gold" size="xl" disabled={saving}>
          {saving ? "Зберігаємо..." : "Зберегти"}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-sm text-brand-dark">Збережено</p>}
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
