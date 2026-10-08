import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./assets/components/Header";
import Apartments from "./assets/pages/ApartmentsPage";
import About from "./assets/pages/AboutUsPage";
import News from "./assets/pages/NewsPage";
import Advantages from "./assets/pages/AdvantagesPage";
import Contacts from "./assets/pages/ContactsPage";
import AboutDeveloper from "./assets/pages/AboutDeveloperPage";
import ConstructionProgress from "./assets/pages/ConstructionProgressPage";


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
      </BrowserRouter>
    </>
  )
}

export default App
