import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/content";
import { api } from "@/lib/api";
import ImagePicker from "./ImagePicker";
import { fieldClass } from "./fields";

const emptyArticle = () => ({
  id: null,
  date: new Date().toISOString().slice(0, 10),
  title: "",
  text: "",
  image: "courtyard",
  paragraphs: [],
  gallery: [],
});

const Label = ({ title, children }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {title}
    {children}
  </label>
);

const NewsEditor = ({ article, onSave, onCancel, error, saving }) => {
  const [draft, setDraft] = useState({
    ...article,
    body: article.paragraphs.join("\n\n"),
  });
  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const submit = (event) => {
    event.preventDefault();
    const { body, ...rest } = draft;
    onSave({
      ...rest,
      paragraphs: body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-card">
      <div className="grid gap-5 md:grid-cols-[1fr_200px]">
        <Label title="Заголовок">
          <input
            required
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            className={fieldClass}
          />
        </Label>
        <Label title="Дата">
          <input
            required
            type="date"
            value={draft.date}
            onChange={(e) => update({ date: e.target.value })}
            className={fieldClass}
          />
        </Label>
      </div>

      <Label title="Короткий опис (у списку новин)">
        <textarea
          required
          rows={2}
          value={draft.text}
          onChange={(e) => update({ text: e.target.value })}
          className={fieldClass}
        />
      </Label>

      <Label title="Головне фото">
        <ImagePicker value={draft.image} onChange={(image) => update({ image })} />
      </Label>

      <Label title="Повний текст (абзаци розділяйте порожнім рядком)">
        <textarea
          rows={8}
          value={draft.body}
          onChange={(e) => update({ body: e.target.value })}
          className={fieldClass}
        />
      </Label>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-slate-700">Додаткові фото</span>
        {draft.gallery.map((image, index) => (
          <ImagePicker
            key={index}
            value={image}
            onChange={(value) =>
              update({ gallery: draft.gallery.map((g, i) => (i === index ? value : g)) })
            }
            onRemove={() =>
              update({ gallery: draft.gallery.filter((_, i) => i !== index) })
            }
          />
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => update({ gallery: [...draft.gallery, "courtyard"] })}
        >
          <Plus size={16} /> Додати фото
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="gold" size="xl" disabled={saving}>
          {saving ? "Зберігаємо..." : "Зберегти"}
        </Button>
        <Button type="button" variant="outline" size="xl" onClick={onCancel}>
          Скасувати
        </Button>
      </div>
    </form>
  );
};

const NewsAdmin = () => {
  const [news, setNews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () =>
    api("/news")
      .then(setNews)
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const save = async ({ id, ...article }) => {
    setSaving(true);
    setError("");
    try {
      await api(id ? `/admin/news/${id}` : "/admin/news", {
        method: id ? "PUT" : "POST",
        body: article,
      });
      await load();
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (article) => {
    if (!window.confirm(`Видалити новину «${article.title}»?`)) return;
    try {
      await api(`/admin/news/${article.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (article) => {
    setError("");
    setEditing(article);
  };

  if (editing) {
    return (
      <NewsEditor
        article={editing}
        onSave={save}
        onCancel={() => setEditing(null)}
        error={error}
        saving={saving}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="gold"
        size="xl"
        className="w-fit"
        onClick={() => edit(emptyArticle())}
      >
        <Plus size={18} /> Додати новину
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {news.length === 0 && <p className="text-slate-500">Новин поки немає.</p>}

      {news.map((article) => (
        <div
          key={article.id}
          className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card"
        >
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wide text-brand-dark">
              {formatDate(article.date)}
            </p>
            <p className="truncate text-base font-medium">{article.title}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="icon" onClick={() => edit(article)} aria-label="Редагувати">
              <Pencil size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => remove(article)} aria-label="Видалити">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsAdmin;
