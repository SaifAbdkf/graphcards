import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/HomePage";

import LabPage from "./pages/LabPage";

import styles from "./App.module.scss";
import NavBar from "./constituants/NavBar";
export default function App() {
  const location = useLocation().pathname;
  return (
    <div className={`${styles.appContainer}`}>
      <div className={styles.navbarContainer}>
        <NavBar />
      </div>

      <div
        className={`${styles.pageContentContainer} ${
          location === "/lab" && styles.labPageContainer
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab" element={<LabPage />} />
        </Routes>
      </div>
    </div>
  );
}
