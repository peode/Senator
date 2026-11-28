import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdvantageIcon from "@/components/AdvantageIcon";
import { advantageIcons } from "@/data/advantageIcons";
import { resolveImage } from "@/data/images";
import { useAdvantagesStore } from "@/stores/advantagesStore";
import AdminListSkeleton from "./AdminListSkeleton";
import ImagePicker from "./ImagePicker";
import { fieldClass } from "./fields";
import { useLeaveWarning } from "./useLeaveWarning";

const groups = [
  { placement: "HOME", title: "Блок на головній сторінці", empty: { icon: "shield" } },
  { placement: "PAGE", title: "Сторінка «Переваги»", empty: { image: "courtyard" } },
];

const Label = ({ title, children }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {title}
    {children}
  </label>
);

const AdvantageEditor = ({ advantage, onSave, onCancel, error, saving }) => {
  const [draft, setDraft] = useState(advantage);
  const dirty = JSON.stringify(draft) !== JSON.stringify(advantage);
  useLeaveWarning(dirty);
  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const submit = (event) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-card">
      <Label title="Заголовок">
        <input
          required
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          className={fieldClass}
        />
      </Label>

      <Label title="Опис">
        <textarea
          required
          rows={4}
          value={draft.text}
          onChange={(e) => update({ text: e.target.value })}
          className={fieldClass}
        />
      </Label>

      {draft.placement === "HOME" ? (
        <Label title="Іконка">
          <span className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-dark">
              <AdvantageIcon name={draft.icon} size={24} strokeWidth={1.5} />
            </span>
            <select
              value={draft.icon}
              onChange={(e) => update({ icon: e.target.value })}
              className={`${fieldClass} max-w-[220px]`}
            >
              {Object.entries(advantageIcons).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </span>
        </Label>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Фото
          <ImagePicker value={draft.image} onChange={(image) => update({ image })} />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="gold" size="xl" disabled={saving}>
          {saving ? "Зберігаємо..." : "Зберегти"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xl"
          onClick={() => (!dirty || window.confirm("Зміни не збережено. Вийти без збереження?")) && onCancel()}
        >
          Скасувати
        </Button>
      </div>
    </form>
  );
};

const AdvantageRow = ({ item, isFirst, isLast, onMove, onEdit, onRemove }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
    {item.placement === "HOME" ? (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface text-brand-dark">
        <AdvantageIcon name={item.icon} size={24} strokeWidth={1.5} />
      </span>
    ) : (
      <img
        src={resolveImage(item.image)}
        alt=""
        loading="lazy"
        className="size-12 shrink-0 rounded-lg object-cover"
      />
    )}

    <div className="min-w-0 flex-1">
      <p className="truncate text-base font-medium">{item.title}</p>
      <p className="truncate text-sm text-slate-500">{item.text}</p>
    </div>

    <div className="flex shrink-0 flex-wrap justify-end gap-2">
      <Button variant="outline" size="icon-lg" disabled={isFirst} onClick={() => onMove(-1)} aria-label={`Вище: ${item.title}`}>
        <ArrowUp size={16} />
      </Button>
      <Button variant="outline" size="icon-lg" disabled={isLast} onClick={() => onMove(1)} aria-label={`Нижче: ${item.title}`}>
        <ArrowDown size={16} />
      </Button>
      <Button variant="outline" size="icon-lg" onClick={onEdit} aria-label={`Редагувати: ${item.title}`}>
        <Pencil size={16} />
      </Button>
      <Button variant="outline" size="icon-lg" onClick={onRemove} aria-label={`Видалити: ${item.title}`}>
        <Trash2 size={16} />
      </Button>
    </div>
  </div>
);

const AdvantagesAdmin = () => {
  const advantages = useAdvantagesStore((state) => state.advantages);
  const loading = useAdvantagesStore((state) => state.loading);
  const loadFailed = useAdvantagesStore((state) => state.error);
  const fetchAdvantages = useAdvantagesStore((state) => state.fetchAdvantages);
  const saveAdvantage = useAdvantagesStore((state) => state.saveAdvantage);
  const removeAdvantage = useAdvantagesStore((state) => state.removeAdvantage);
  const reorderAdvantages = useAdvantagesStore((state) => state.reorderAdvantages);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // в адмінці завжди свіжі дані, а не кеш
  useEffect(() => {
    fetchAdvantages({ force: true });
  }, [fetchAdvantages]);

  const save = async (advantage) => {
    setSaving(true);
    setError("");
    try {
      await saveAdvantage(advantage);
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (advantage) => {
    if (!window.confirm(`Видалити перевагу «${advantage.title}»?`)) return;
    setError("");
    try {
      await removeAdvantage(advantage.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const move = async (items, index, delta) => {
    const ids = items.map(({ id }) => id);
    [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
    setError("");
    try {
      await reorderAdvantages(ids);
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (advantage) => {
    setError("");
    setEditing(advantage);
  };

  if (editing) {
    return (
      <AdvantageEditor
        advantage={editing}
        onSave={save}
        onCancel={() => setEditing(null)}
        error={error}
        saving={saving}
      />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loadFailed && <p className="text-sm text-red-600">Не вдалося завантажити переваги.</p>}

      {groups.map(({ placement, title, empty }) => {
        const items = advantages.filter((item) => item.placement === placement);

        return (
          <section key={placement} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{title}</h2>
              <Button
                variant="gold"
                size="xl"
                onClick={() => edit({ id: null, placement, title: "", text: "", ...empty })}
              >
                <Plus size={18} /> Додати перевагу
              </Button>
            </div>

            {loading && <AdminListSkeleton />}

            {!loading && !loadFailed && items.length === 0 && (
              <p className="text-slate-500">Переваг поки немає.</p>
            )}

            {items.map((item, index) => (
              <AdvantageRow
                key={item.id}
                item={item}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onMove={(delta) => move(items, index, delta)}
                onEdit={() => edit(item)}
                onRemove={() => remove(item)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
};

export default AdvantagesAdmin;
