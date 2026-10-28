import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsAdmin from "./admin/NewsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";
import LeadsAdmin from "./admin/LeadsAdmin";
import { api } from "@/lib/api";
import { fieldClass } from "./admin/fields";

const tabs = [
  { id: "leads", label: "Заявки" },
  { id: "news", label: "Новини" },
  { id: "settings", label: "Налаштування" },
];

const Login = ({ onLogin }) => {
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api("/session", {
        method: "POST",
        body: { password: new FormData(event.currentTarget).get("password") },
      });
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-[5%]">
      <form
        onSubmit={submit}
        className="flex w-full max-w-[380px] flex-col gap-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <h1 className="text-2xl font-bold">Адмін-панель</h1>
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Пароль"
          className={fieldClass}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="gold" size="xl">Увійти</Button>
      </form>
    </div>
  );
};

const Admin = () => {
  // null — ще перевіряємо сесію на сервері
  const [loggedIn, setLoggedIn] = useState(null);
  const [tab, setTab] = useState("leads");
  const navigate = useNavigate();

  useEffect(() => {
    api("/session")
      .then(({ authenticated }) => setLoggedIn(authenticated))
      .catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn === null) return null;
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const logout = async () => {
    await api("/session", { method: "DELETE" }).catch(() => {});
    navigate("/");
  };

  return (
    <div className="min-h-svh bg-surface">
      <header className="flex items-center justify-between bg-ink px-[5%] py-5 text-white">
        <a href="/" className="text-lg font-medium">
          ЖК «Senator» · Адмін-панель
        </a>
        <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={logout}>
          <LogOut size={16} /> Вийти
        </Button>
      </header>

      <div className="mx-auto max-w-[1000px] px-[5%] py-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`h-11 cursor-pointer rounded-full px-6 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-ink text-white"
                  : "bg-white text-slate-700 hover:text-brand-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "leads" && <LeadsAdmin />}
        {tab === "news" && <NewsAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </div>
    </div>
  );
};

export default Admin;
