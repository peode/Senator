import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Apartments from "./pages/ApartmentsPage";
import SectionPage from "./pages/SectionPage";
import About from "./pages/AboutUsPage";
import News from "./pages/NewsPage";
import NewsArticle from "./pages/NewsArticlePage";
import Advantages from "./pages/AdvantagesPage";
import Contacts from "./pages/ContactsPage";
import AboutDeveloper from "./pages/AboutDeveloperPage";
import NotFound from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import LeadModal from "./components/LeadModal";
import { cn } from "./lib/utils";
import { useSettingsStore } from "./stores/settingsStore";
import { useSiteImagesStore } from "./stores/siteImagesStore";
import { useSiteTextsStore } from "./stores/siteTextsStore";

// адмінка потрібна лише адміністратору: відвідувачі сайту її не завантажують
const Admin = lazy(() => import("./pages/AdminPage"));

const Layout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const fetchImages = useSiteImagesStore((state) => state.fetchImages);
  const fetchTexts = useSiteTextsStore((state) => state.fetchTexts);

  useEffect(() => {
    fetchSettings();
    fetchImages();
    fetchTexts();
  }, [fetchSettings, fetchImages, fetchTexts]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    window.scrollTo(0, 0);
    // інакше після переходу фокус лишається на зниклому посиланні, а екранний диктор мовчить
    mainRef.current.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      {!isAdmin && (
        <a
          href="#main"
          className="sr-only z-200 rounded-lg bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Перейти до вмісту
        </a>
      )}
      {!isAdmin && <Header />}
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className={cn("focus:outline-none", !isAdmin && !isHome && "pt-[76px] lg:pt-[88px]")}
      >
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/apartments/:sectionId" element={<SectionPage />} />
          <Route path="/advantages" element={<Advantages />} />
          <Route path="/aboutdeveloper" element={<AboutDeveloper />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-svh bg-surface" />}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <LeadModal />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
