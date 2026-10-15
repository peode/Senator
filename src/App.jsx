import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Apartments from "./pages/ApartmentsPage";
import About from "./pages/AboutUsPage";
import News from "./pages/NewsPage";
import Advantages from "./pages/AdvantagesPage";
import Contacts from "./pages/ContactsPage";
import AboutDeveloper from "./pages/AboutDeveloperPage";
import ConstructionProgress from "./pages/ConstructionProgressPage";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/apartments" element={<Apartments />} />
          <Route path="/advantages" element={<Advantages />} />
          <Route path="/aboutdeveloper" element={<AboutDeveloper />} />
          <Route path="/news" element={<News />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/constructionprogress" element={<ConstructionProgress />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
