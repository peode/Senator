import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NOTICE_MS = 2500;

// Телефон відкриває системне меню «Поділитися», а комп'ютер копіює посилання
const ShareButton = ({ url, title, label, className }) => {
  const [notice, setNotice] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const showNotice = (text) => {
    setNotice(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotice(null), NOTICE_MS);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showNotice("Посилання скопійовано");
    } catch {
      showNotice(`Скопіюйте посилання: ${url}`);
    }
  };

  const share = async () => {
    if (!navigator.share) return copyLink();

    try {
      await navigator.share({ title, url });
    } catch (error) {
      // людина сама закрила меню: копіювати нічого не треба
      if (error.name !== "AbortError") await copyLink();
    }
  };

  return (
    <div className={className}>
      {notice && (
        <span
          role="status"
          className="absolute right-0 bottom-full mb-2 w-max max-w-[min(280px,70vw)] rounded-md bg-ink px-3 py-2 text-[13px] font-medium break-all text-white shadow-tooltip"
        >
          {notice}
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={label}
        title={label}
        className="size-11 bg-white"
        onClick={share}
      >
        <Share2 aria-hidden="true" />
      </Button>
    </div>
  );
};

export default ShareButton;
