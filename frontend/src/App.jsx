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

const Layout = () => {
  const isAdmin = useLocation().pathname.startsWith("/admin");

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
