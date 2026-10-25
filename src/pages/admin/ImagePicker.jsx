import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageLibrary, resolveImage } from "@/data/images";
import { fieldClass } from "./fields";

// Стискає завантажене фото, щоб воно поміщалось у localStorage
const readImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, 1400 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });

const ImagePicker = ({ value, onChange, onRemove }) => {
  const isLibrary = value in imageLibrary;

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onChange(await readImage(file));
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img
          src={resolveImage(value)}
          alt=""
          className="size-16 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="size-16 shrink-0 rounded-lg bg-neutral-200" />
      )}

      <select
        value={isLibrary ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} max-w-[220px]`}
      >
        <option value="" disabled>
          {value ? "Власне фото" : "Оберіть фото"}
        </option>
        {Object.entries(imageLibrary).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-3 text-sm font-medium hover:border-brand">
        <Upload size={16} /> Завантажити
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>

      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label="Прибрати фото"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};

export default ImagePicker;
