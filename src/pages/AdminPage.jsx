import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsAdmin from "./admin/NewsAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";
import { fieldClass } from "./admin/fields";

// Лише для демонстрації: пароль перевіряється в браузері і не захищає дані.
// Для реального захисту потрібна авторизація на сервері.
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "senator-admin";
const SESSION_KEY = "senator:admin";

const isLoggedIn = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
};

const tabs = [
  { id: "news", label: "Новини" },
  { id: "settings", label: "Налаштування" },
];

const Login = ({ onLogin }) => {
  const [error, setError] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (new FormData(event.currentTarget).get("password") === PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // без sessionStorage вхід діятиме до перезавантаження
      }
      onLogin();
    } else {
      setError(true);
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
        {error && <p className="text-sm text-red-600">Невірний пароль</p>}
        <Button type="submit" variant="gold" size="xl">Увійти</Button>
      </form>
    </div>
  );
};

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [tab, setTab] = useState("news");
  const navigate = useNavigate();

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // нічого очищати
    }
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

        {tab === "news" && <NewsAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </div>
    </div>
  );
};

export default Admin;
