import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice, sectionStatuses } from "@/data/sections";
import { cn } from "@/lib/utils";
import { useSections } from "@/stores/sectionsStore";
import AdminListSkeleton from "./AdminListSkeleton";
import SectionEditor from "./SectionEditor";

const SectionCard = ({ section, onEdit }) => {
  const status = sectionStatuses[section.status];
  const units = section.apartments.flatMap((apartment) => apartment.units);
  const sold = units.filter((unit) => !unit.available).length;

  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-card">
      <div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h2 className="text-base font-medium">Секція №{section.id}</h2>
          <span className={cn("inline-flex items-center gap-2 text-sm font-medium", status.textClass)}>
            <span className={cn("size-[9px] rounded-full", status.dotClass)} />
            {status.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {section.price ? `${formatPrice(section.price)} $/м²` : "Ціну не вказано"} · Поверхів: {section.floors}
          {" · "}
          {section.plan
            ? `Квартир на плані: ${section.apartments.length}, продано ${sold} із ${units.length}`
            : "План не завантажено"}
        </p>
      </div>

      <Button variant="outline" size="lg" className="px-4" onClick={onEdit}>
        Редагувати
      </Button>
    </article>
  );
};

const SectionsAdmin = () => {
  const { sections, loading, error } = useSections();
  const [editingId, setEditingId] = useState(null);

  if (loading) return <AdminListSkeleton />;
  if (error) return <p className="text-sm text-red-600">Не вдалося завантажити секції.</p>;

  const editing = sections.find((section) => section.id === editingId);
  if (editing) {
    return <SectionEditor key={editing.id} section={editing} onBack={() => setEditingId(null)} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} onEdit={() => setEditingId(section.id)} />
      ))}
    </div>
  );
};

export default SectionsAdmin;
