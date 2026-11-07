import { useState } from "react";
import { Button } from "@/components/ui/button";
import { socialLabels } from "@/data/socials";
import { useSettings, useSettingsStore } from "@/stores/settingsStore";
import { fieldClass } from "./fields";

const Label = ({ title, children }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {title}
    {children}
  </label>
);

const SettingsForm = ({ settings }) => {
  const saveSettings = useSettingsStore((state) => state.saveSettings);
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (patch) => {
    setSaved(false);
    setDraft((current) => ({ ...current, ...patch }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveSettings(draft);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex max-w-[640px] flex-col gap-5 rounded-2xl bg-white p-6 shadow-card">
      <Label title="Телефон відділу продажу">
        <input
          value={draft.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className={fieldClass}
        />
      </Label>
      <Label title="Адреса">
        <input
          value={draft.address}
          onChange={(e) => update({ address: e.target.value })}
          className={fieldClass}
        />
      </Label>
      <Label title="Години роботи">
        <textarea
          rows={2}
          value={draft.hours}
          onChange={(e) => update({ hours: e.target.value })}
          className={fieldClass}
        />
      </Label>

      {Object.entries(socialLabels).map(([key, label]) => (
        <Label key={key} title={label}>
          <input
            type="url"
            value={draft.socials[key]}
            onChange={(e) =>
              update({ socials: { ...draft.socials, [key]: e.target.value } })
            }
            className={fieldClass}
          />
        </Label>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" variant="gold" size="xl" disabled={saving}>
          {saving ? "Зберігаємо..." : "Зберегти"}
        </Button>
        {saved && <span className="text-sm text-brand-dark">Збережено</span>}
      </div>
    </form>
  );
};

// Форма з'являється лише з даними сервера, інакше збереження затерло б їх значеннями за замовчуванням
const SettingsAdmin = () => {
  const settings = useSettings();
  const loaded = useSettingsStore((state) => state.loaded);
  const error = useSettingsStore((state) => state.error);

  if (!loaded) {
    return error ? <p className="text-sm text-red-600">Не вдалося завантажити налаштування.</p> : null;
  }

  return <SettingsForm settings={settings} />;
};

export default SettingsAdmin;
