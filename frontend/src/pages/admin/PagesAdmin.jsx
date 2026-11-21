import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteTextDefaults, sitePages } from "@/data/sitePages";
import { cn } from "@/lib/utils";
import { useSiteTextsStore } from "@/stores/siteTextsStore";
import AdminListSkeleton from "./AdminListSkeleton";
import { fieldClass } from "./fields";
import SiteImageCard from "./SiteImageCard";

const panelClass = "rounded-2xl bg-white shadow-card";

const pageFields = (page) => page.blocks.flatMap(({ fields }) => fields);

const toDraft = (page, texts) =>
  Object.fromEntries(pageFields(page).map(({ key }) => [key, texts[key] ?? siteTextDefaults[key]]));

const Block = ({ block, draft, onChange, open }) => (
  <details open={open} className={cn(panelClass, "group")}>
    <summary className="cursor-pointer rounded-2xl p-5 text-base font-medium select-none">{block.title}</summary>

    <div className="flex flex-col gap-4 px-5 pb-5">
      {block.note && <p className="text-sm text-slate-500">{block.note}</p>}

      {block.fields.map(({ key, label, long }) => (
        <label key={key} className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          {label}
          {long ? (
            <textarea
              rows={3}
              value={draft[key]}
              placeholder={siteTextDefaults[key]}
              onChange={(event) => onChange(key, event.target.value)}
              className={fieldClass}
            />
          ) : (
            <input
              value={draft[key]}
              placeholder={siteTextDefaults[key]}
              onChange={(event) => onChange(key, event.target.value)}
              className={fieldClass}
            />
          )}
        </label>
      ))}

      {block.images && (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.images.map((key) => (
            <SiteImageCard key={key} slotKey={key} />
          ))}
        </div>
      )}
    </div>
  </details>
);

const PageEditor = ({ page, onDirtyChange }) => {
  const texts = useSiteTextsStore((state) => state.texts);
  const saveTexts = useSiteTextsStore((state) => state.saveTexts);
  const [draft, setDraft] = useState(() => toDraft(page, texts));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const stored = toDraft(page, texts);
  const changedKeys = Object.keys(draft).filter((key) => draft[key].trim() !== stored[key]);
  const dirty = changedKeys.length > 0;
  const hasFields = pageFields(page).length > 0;

  useEffect(() => {
    onDirtyChange(dirty);
    if (!dirty) return undefined;

    const warn = (event) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, onDirtyChange]);

  const change = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      // стандартний текст у базі не потрібен: порожнє поле теж повертає його
      await saveTexts(
        Object.fromEntries(
          changedKeys.map((key) => {
            const value = draft[key].trim();
            return [key, value && value !== siteTextDefaults[key] ? value : null];
          }),
        ),
      );
      setDraft(toDraft(page, useSiteTextsStore.getState().texts));
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{page.label}</h2>
        {page.url && (
          <a
            href={page.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:underline"
          >
            Відкрити на сайті <ExternalLink size={15} />
          </a>
        )}
      </div>

      <p className="text-sm text-slate-600">
        {hasFields && "Порожнє поле повертає стандартний текст. "}
        Картинки зберігаються одразу після завантаження{hasFields && ", а тексти — кнопкою внизу"}.
      </p>

      {page.blocks.map((block, index) => (
        <Block key={block.title} block={block} draft={draft} onChange={change} open={index === 0} />
      ))}

      {hasFields && (
        <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-card-hover">
          <Button type="submit" variant="gold" size="xl" disabled={saving || !dirty}>
            {saving ? "Зберігаємо..." : "Зберегти тексти"}
          </Button>
          {dirty && (
            <Button
              type="button"
              variant="ghost"
              size="xl"
              disabled={saving}
              onClick={() => setDraft(stored)}
            >
              Скасувати зміни
            </Button>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && !dirty && <p className="text-sm text-brand-dark">Збережено</p>}
        </div>
      )}
    </form>
  );
};

const PagesAdmin = () => {
  const loaded = useSiteTextsStore((state) => state.loaded);
  const [pageId, setPageId] = useState(sitePages[0].id);
  const [dirty, setDirty] = useState(false);
  const page = sitePages.find(({ id }) => id === pageId);

  const openPage = (id) => {
    if (id === pageId) return;
    if (!dirty || window.confirm("Тексти не збережено. Перейти без збереження?")) {
      setDirty(false);
      setPageId(id);
    }
  };

  if (!loaded) return <AdminListSkeleton />;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <nav aria-label="Сторінки сайту" className="lg:sticky lg:top-4 lg:w-52 lg:shrink-0">
        <ul className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-2 shadow-card lg:flex-col">
          {sitePages.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              <button
                type="button"
                aria-current={id === pageId ? "page" : undefined}
                onClick={() => openPage(id)}
                className={cn(
                  "w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-colors",
                  id === pageId ? "bg-gold text-ink" : "text-slate-700 hover:bg-surface",
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <PageEditor key={pageId} page={page} onDirtyChange={setDirty} />
    </div>
  );
};

export default PagesAdmin;
