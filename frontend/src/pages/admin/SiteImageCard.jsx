import { useState } from "react";
import { RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoClass, siteImageSlots } from "@/data/siteImages";
import { readImage } from "@/lib/readImage";
import { cn } from "@/lib/utils";
import { useSiteImage, useSiteImagesStore } from "@/stores/siteImagesStore";

const ImageCard = ({ slotKey }) => {
  const slot = siteImageSlots[slotKey];
  const siteImage = useSiteImage();
  const replaced = useSiteImagesStore((state) => Boolean(state.images[slotKey]));
  const saveImage = useSiteImagesStore((state) => state.saveImage);
  const resetImage = useSiteImagesStore((state) => state.resetImage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isLogo = slotKey === "logo";

  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    run(async () => {
      const { src, width, height } = await readImage(file, slot.maxWidth);
      await saveImage(slotKey, { image: src, width, height });
    });
  };

  const reset = () => {
    if (window.confirm(`Повернути стандартну картинку: «${slot.label}»?`)) {
      run(() => resetImage(slotKey));
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      <div className={cn("relative aspect-[3/2]", isLogo ? "bg-ink" : "bg-slate-200")}>
        <img
          src={siteImage(slotKey)}
          alt=""
          loading="lazy"
          className={cn("absolute inset-0 size-full", isLogo ? cn("object-contain p-8", logoClass) : "object-cover")}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base leading-snug font-medium">{slot.label}</h3>
          <p className="mt-1 text-sm text-slate-500">{replaced ? "Завантажена картинка" : "Стандартна картинка"}</p>
          {slot.hint && <p className="mt-1 text-sm text-slate-500">{slot.hint}</p>}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-auto flex flex-wrap gap-2">
          <label
            className={cn(
              "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-gold px-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-hover",
              busy && "pointer-events-none opacity-50",
            )}
          >
            <Upload size={16} /> {busy ? "Зберігаємо..." : "Замінити"}
            <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={onFile} />
          </label>

          {replaced && (
            <Button variant="outline" size="lg" className="px-3" disabled={busy} onClick={reset}>
              <RotateCcw /> Стандартна
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ImageCard;
