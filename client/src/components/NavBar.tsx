import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";

export default function NavBar() {
  const location = useLocation().pathname;
  console.log(location);
  return (
    <div className={styles.navBar}>
      <div>
        <Link to="/" className={styles.logo}>
          <div> GraphCards </div>
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link
          to="/decks"
          className={`${styles.link} ${location === "/decks" && styles.active}`}
        >
          <span key={"deck"}> Deck </span>
        </Link>
        <Link
          to="/playground"
          className={`${styles.link} ${
            location === "/playground" && styles.active
          }`}
        >
          <span key={"playground"}> Playground </span>
        </Link>
      </div>
    </div>
  );
}
