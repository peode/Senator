import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useLeadModalStore } from "@/stores/leadModalStore";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-3 text-base text-ink transition-colors focus:border-brand-dark aria-invalid:border-red-600";

// Поле з підписом: помилка прив'язана до нього, тож її озвучить і екранний диктор
const Field = ({ label, name, error, children }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {label}
    {children({
      name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `lead-${name}-error` : undefined,
      className: fieldClass,
    })}
    {error && (
      <span id={`lead-${name}-error`} className="text-xs text-red-600">
        {error}
      </span>
    )}
  </label>
);

const LeadForm = ({ presetComment, onSent }) => {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState(presetComment);
  const [lastPreset, setLastPreset] = useState(presetComment);

  // ім'я й телефон лишаються, а коментар оновлюємо, якщо заявку відкрили для іншої квартири
  if (presetComment !== lastPreset) {
    setLastPreset(presetComment);
    if (presetComment) setComment(presetComment);
  }

  useEffect(() => {
    const [firstError] = Object.keys(errors);
    if (firstError) formRef.current.elements[firstError]?.focus();
  }, [errors]);

  const submit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setSending(true);
    setErrors({});
    setMessage("");

    try {
      await api("/leads", { method: "POST", body: data });
      onSent();
    } catch (error) {
      setErrors(error.fields ?? {});
      setMessage(error.message);
      setSending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="pr-8">
        <h2 className="text-2xl font-bold">Заявка на дзвінок</h2>
        <p className="mt-1 text-sm text-slate-600">
          Залиште контакти — менеджер зателефонує та відповість на всі запитання.
        </p>
      </div>

      <Field label="Ім'я" name="name" error={errors.name}>
        {(props) => <input {...props} required maxLength={100} autoComplete="name" />}
      </Field>

      <Field label="Телефон" name="phone" error={errors.phone}>
        {(props) => (
          <input
            {...props}
            type="tel"
            required
            maxLength={25}
            autoComplete="tel"
            placeholder="+38 (0__) ___-__-__"
          />
        )}
      </Field>

      <Field label="Коментар (необов'язково)" name="comment" error={errors.comment}>
        {(props) => (
          <textarea
            {...props}
            rows={3}
            maxLength={1000}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        )}
      </Field>

      {/* приманка для ботів */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {message && !Object.keys(errors).length && (
        <p role="alert" className="text-sm text-red-600">{message}</p>
      )}

      <Button type="submit" variant="gold" size="xl" disabled={sending}>
        {sending ? "Надсилаємо..." : "Надіслати заявку"}
      </Button>
    </form>
  );
};

const LeadModal = () => {
  const dialogRef = useRef(null);
  const isOpen = useLeadModalStore((state) => state.isOpen);
  const comment = useLeadModalStore((state) => state.comment);
  const close = useLeadModalStore((state) => state.close);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleClose = () => {
    close();
    setSent(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(event) => event.target === dialogRef.current && handleClose()}
      className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-2xl bg-white p-0 text-ink shadow-card backdrop:bg-ink/60"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрити"
          className="absolute top-2 right-2 flex size-11 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:text-ink"
        >
          <X size={22} />
        </button>

        {/* форма не розмонтовується при закритті: випадковий клік повз неї не стирає введене */}
        {sent ? (
          <div role="status" className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 size={48} className="text-brand-dark" />
            <h2 className="text-2xl font-bold">Дякуємо!</h2>
            <p className="text-slate-600">Заявку отримано. Ми зателефонуємо вам найближчим часом.</p>
            <Button variant="gold" size="xl" onClick={handleClose}>Закрити</Button>
          </div>
        ) : (
          <LeadForm presetComment={comment} onSent={() => setSent(true)} />
        )}
      </div>
    </dialog>
  );
};

export default LeadModal;
