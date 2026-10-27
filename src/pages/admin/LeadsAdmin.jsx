import { useEffect, useState } from "react";
import { Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phoneHref } from "@/lib/content";
import { api } from "@/lib/api";
import { fieldClass } from "./fields";

const statuses = {
  NEW: "Нова",
  IN_PROGRESS: "В роботі",
  DONE: "Оброблена",
};

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" });

const LeadsAdmin = () => {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/leads")
      .then(setLeads)
      .catch((err) => setError(err.message));
  }, []);

  const setStatus = async (lead, status) => {
    try {
      const updated = await api(`/admin/leads/${lead.id}`, { method: "PATCH", body: { status } });
      setLeads((current) => current.map((item) => (item.id === lead.id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (lead) => {
    if (!window.confirm(`Видалити заявку від ${lead.name}?`)) return;
    try {
      await api(`/admin/leads/${lead.id}`, { method: "DELETE" });
      setLeads((current) => current.filter((item) => item.id !== lead.id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!leads) return error ? <p className="text-sm text-red-600">{error}</p> : null;

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {leads.length === 0 && <p className="text-slate-500">Заявок поки немає.</p>}

      {leads.map((lead) => (
        <div
          key={lead.id}
          className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wide text-brand-dark">
              {formatDateTime(lead.createdAt)}
            </p>
            <p className="text-base font-medium">{lead.name}</p>
            <a
              href={phoneHref(lead.phone)}
              className="inline-flex items-center gap-2 text-[15px] hover:text-brand-dark"
            >
              <Phone size={15} /> {lead.phone}
            </a>
            {lead.comment && (
              <p className="mt-2 text-sm whitespace-pre-line text-slate-600">{lead.comment}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <select
              value={lead.status}
              onChange={(event) => setStatus(lead, event.target.value)}
              className={`${fieldClass} w-auto`}
            >
              {Object.entries(statuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="icon" onClick={() => remove(lead)} aria-label="Видалити">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsAdmin;
