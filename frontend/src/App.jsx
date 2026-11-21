import { useEffect } from "react";
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
import Admin from "./pages/AdminPage";
import Footer from "./components/Footer";
import LeadModal from "./components/LeadModal";
import { useSettingsStore } from "./stores/settingsStore";
import { useSiteImagesStore } from "./stores/siteImagesStore";
import { useSiteTextsStore } from "./stores/siteTextsStore";

const Layout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const fetchImages = useSiteImagesStore((state) => state.fetchImages);
  const fetchTexts = useSiteTextsStore((state) => state.fetchTexts);

  useEffect(() => {
    fetchSettings();
    fetchImages();
    fetchTexts();
  }, [fetchSettings, fetchImages, fetchTexts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apartments/:sectionId" element={<SectionPage />} />
        <Route path="/advantages" element={<Advantages />} />
        <Route path="/aboutdeveloper" element={<AboutDeveloper />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsArticle />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
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
