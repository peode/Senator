import { useEffect } from "react";

const SITE_NAME = "ЖК «Senator»";
const DEFAULT_TITLE = `${SITE_NAME} — квартири в новобудові, Чернівці`;
const DEFAULT_DESCRIPTION =
  "Житловий комплекс «Senator» у Чернівцях, вул. Руська, 236Б: планування, вільні квартири, ціни й заявка на дзвінок.";

const setMeta = (selector, content) =>
  document.head.querySelector(selector)?.setAttribute("content", content);

// Оновлює теги, вже наявні в index.html: другий <title> браузер проігнорував би
const Seo = ({ title, description = DEFAULT_DESCRIPTION, noindex = false }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;

    document.title = fullTitle;
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="robots"]', noindex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
  }, [title, description, noindex]);

  return null;
};

export default Seo;
