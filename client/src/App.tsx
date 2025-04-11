import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./constituants/pages/HomePage";

import PlaygroundPage from "./constituants/pages/PlaygroundPage";

import styles from "./App.module.scss";
import NavBar from "./constituants/NavBar";
import GraphDecksPage from "./constituants/pages/GraphDecksPage";

export default function App() {
  const location = useLocation().pathname;
  return (
    <div className={`${styles.appContainer}`}>
      <div className={styles.navbarContainer}>
        <NavBar />
      </div>

      <div
        className={`${styles.pageContainer} ${
          location === "/playground" && styles.playgroundPageContainer
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graphdecks" element={<GraphDecksPage />}></Route>
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </div>
    </div>
  );
}
