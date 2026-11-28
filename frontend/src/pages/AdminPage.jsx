import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import NewsAdmin from "./admin/NewsAdmin";
import AdvantagesAdmin from "./admin/AdvantagesAdmin";
import PagesAdmin from "./admin/PagesAdmin";
import SectionsAdmin from "./admin/SectionsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";
import LeadsAdmin from "./admin/LeadsAdmin";
import { useAuthStore } from "@/stores/authStore";
import { fieldClass } from "./admin/fields";

const tabs = [
  { id: "leads", label: "Заявки" },
  { id: "news", label: "Новини" },
  { id: "advantages", label: "Переваги" },
  { id: "pages", label: "Сторінки" },
  { id: "sections", label: "Секції" },
  { id: "settings", label: "Налаштування" },
];

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(new FormData(event.currentTarget).get("password"));
    } catch (err) {
      setError(err.message);
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-[5%]">
      <form
        onSubmit={submit}
        className="flex w-full max-w-[380px] flex-col gap-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold">Адмін-панель</h1>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Пароль
          <input
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className={fieldClass}
          />
        </label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="gold" size="xl" disabled={pending}>
          {pending ? "Входимо..." : "Увійти"}
        </Button>
      </form>
    </div>
  );
};

const Admin = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const checkSession = useAuthStore((state) => state.checkSession);
  const logout = useAuthStore((state) => state.logout);
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab = tabs.some(({ id }) => id === requestedTab) ? requestedTab : "leads";
  // відкрита вкладка лишається змонтованою: чернетка не зникає при переході на іншу
  const [visited, setVisited] = useState(() => new Set([tab]));
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (loggedIn === null) {
    return (
      <div role="status" aria-label="Завантаження" className="flex min-h-svh items-center justify-center bg-surface">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }
  if (!loggedIn) return (
    <>
      <Seo title="Адмін-панель" noindex />
      <Login />
    </>
  );

  const openTab = (id) => {
    setVisited((current) => new Set(current).add(id));
    setSearchParams({ tab: id }, { replace: true });
  };

  const tabPanel = (id, Panel) =>
    visited.has(id) && (
      <div hidden={tab !== id}>
        <Panel />
      </div>
    );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-svh bg-surface">
      <Seo title="Адмін-панель" noindex />
      <header className="flex items-center justify-between bg-ink px-[5%] py-5 text-white">
        <Link to="/" className="text-lg font-medium">
          ЖК «Senator» · Адмін-панель
        </Link>
        <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={handleLogout}>
          <LogOut size={16} /> Вийти
        </Button>
      </header>

      <div className="mx-auto max-w-[1000px] px-[5%] py-8">
        <nav aria-label="Розділи адмін-панелі" className="mb-8 flex flex-wrap gap-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-current={tab === id ? "page" : undefined}
              onClick={() => openTab(id)}
              className={`h-11 cursor-pointer rounded-full px-6 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-ink text-white"
                  : "bg-white text-slate-700 hover:text-brand-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* заявки щоразу завантажуються заново: могли прийти нові */}
        {tab === "leads" && <LeadsAdmin />}
        {tabPanel("news", NewsAdmin)}
        {tabPanel("advantages", AdvantagesAdmin)}
        {tabPanel("pages", PagesAdmin)}
        {tabPanel("sections", SectionsAdmin)}
        {tabPanel("settings", SettingsAdmin)}
      </div>
    </div>
  );
};

export default Admin;
