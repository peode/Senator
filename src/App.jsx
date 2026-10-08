import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./assets/components/Header";
import Apartments from "./assets/pages/Apartments";
import About from "./assets/pages/About";
import News from "./assets/pages/News";
import Advantages from "./assets/pages/Advantages";
import Contacts from "./assets/pages/Contacts";
import AboutDeveloper from "./assets/pages/AboutDeveloper";
import ConstructionProgress from "./assets/pages/ConstructionProgress";


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
