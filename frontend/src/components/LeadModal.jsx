import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-3 text-[15px] text-ink outline-none transition-colors focus:border-brand focus:ring-3 focus:ring-brand/20";

const LeadModal = ({ open, onClose }) => {
  const dialogRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    onClose();
    setStatus("idle");
    setErrors({});
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setErrors({});
    setMessage("");

    try {
      await api("/leads", { method: "POST", body: data });
      form.reset();
      setStatus("sent");
    } catch (error) {
      setErrors(error.fields ?? {});
      setMessage(error.message);
      setStatus("idle");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(event) => event.target === dialogRef.current && close()}
      className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-2xl bg-white p-0 text-ink shadow-card backdrop:bg-ink/60"
    >
      <div className="relative p-6 min-[521px]:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Закрити"
          className="absolute top-4 right-4 cursor-pointer text-slate-500 transition-colors hover:text-ink"
        >
          <X size={22} />
        </button>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 size={48} className="text-brand" />
            <h2 className="text-2xl font-bold">Дякуємо!</h2>
            <p className="text-slate-600">Заявку отримано. Ми зателефонуємо вам найближчим часом.</p>
            <Button variant="gold" size="xl" onClick={close}>Закрити</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <div className="pr-8">
              <h2 className="text-2xl font-bold">Заявка на дзвінок</h2>
              <p className="mt-1 text-sm text-slate-600">
                Залиште контакти — менеджер зателефонує та відповість на всі запитання.
              </p>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Ім'я
              <input name="name" required maxLength={100} autoComplete="name" className={fieldClass} />
              {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Телефон
              <input
                name="phone"
                type="tel"
                required
                maxLength={25}
                autoComplete="tel"
                placeholder="+38 (0__) ___-__-__"
                className={fieldClass}
              />
              {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
              Коментар (необов'язково)
              <textarea name="comment" rows={3} maxLength={1000} className={fieldClass} />
              {errors.comment && <span className="text-xs text-red-600">{errors.comment}</span>}
            </label>

            {/* приманка для ботів */}
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {message && !Object.keys(errors).length && (
              <p className="text-sm text-red-600">{message}</p>
            )}

            <Button type="submit" variant="gold" size="xl" disabled={status === "sending"}>
              {status === "sending" ? "Надсилаємо..." : "Надіслати заявку"}
            </Button>
          </form>
        )}
      </div>
    </dialog>
  );
};

export default LeadModal;
