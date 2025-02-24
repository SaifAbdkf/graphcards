import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/HomePage";
import DecksPage from "./pages/DecksPage";
import PlaygroundPage from "./pages/PlaygroundPage";

import styles from "./App.module.scss";
import NavBar from "./components/NavBar";

export default function App() {
  const location = useLocation().pathname;
  console.log("location", location);
  return (
    <div
      className={`${styles.appContainer} ${
        location === "/playground" && styles.appContainslaygrouund
      }`}
    >
      <div className={styles.navbarContainer}>
        <NavBar />
      </div>

      <div
        className={`${styles.pageContainer} ${
          location === "/playground" && styles.playGroundPage
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<DecksPage location={location} />}>
            <Route path="create" element={<DecksPage location={location} />} />
          </Route>
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </div>
    </div>
  );
}
