import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useCallback, useState } from "react";

export default function NavBar() {
  const location = useLocation().pathname;
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleMouseEnter = useCallback(
    (page: string): React.MouseEventHandler<HTMLDivElement> =>
      () => {
        setHoveredLink(page);
      },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredLink(null);
  }, []);

  return (
    <div className={`${styles.navBar}`}>
      <div>
        <Link to="/" className={styles.logo}>
          <div
            onMouseEnter={handleMouseEnter("home")}
            onMouseLeave={handleMouseLeave}
          >
            GraphCards
          </div>
          <div
            className={` ${
              location === "/" || hoveredLink === "home"
                ? styles.underlineDivLogo
                : ""
            }`}
          ></div>
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/graphdecks" className={`${styles.link} `}>
          <div
            className={`${
              (location === "/graphdecks" || hoveredLink === "graphdecks") &&
              styles.underlineDiv
            }`}
          ></div>
          <div
            key={"deck"}
            onMouseEnter={handleMouseEnter("graphdecks")}
            onMouseLeave={handleMouseLeave}
          >
            GraphDeck
          </div>
        </Link>
        <Link to="/playground" className={`${styles.link} `}>
          <div
            className={` ${
              (location === "/playground" || hoveredLink === "playground") &&
              styles.underlineDiv
            }`}
          ></div>
          <div
            key={"playground"}
            onMouseEnter={handleMouseEnter("playground")}
            onMouseLeave={handleMouseLeave}
          >
            Playground
          </div>
        </Link>
      </div>
    </div>
  );
}
