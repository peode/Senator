import { useState } from "react";
import { Button } from "@/components/ui/button";
import { socialLabels } from "@/data/socials";
import { settingsStore, useSettings } from "@/lib/content";
import { fieldClass } from "./fields";

const Label = ({ title, children }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {title}
    {children}
  </label>
);

const SettingsAdmin = () => {
  const settings = useSettings();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const update = (patch) => {
    setSaved(false);
    setDraft((current) => ({ ...current, ...patch }));
  };

  const submit = (event) => {
    event.preventDefault();
    settingsStore.set(draft);
    setSaved(true);
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

      <div className="flex items-center gap-4">
        <Button type="submit" variant="gold" size="xl">Зберегти</Button>
        {saved && <span className="text-sm text-brand-dark">Збережено</span>}
      </div>
    </form>
  );
};

export default SettingsAdmin;
