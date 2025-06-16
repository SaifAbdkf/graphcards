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
      <div
        className={`${styles.logo} ${
          (location === "/" || hoveredLink === "home") && styles.selectedColor
        }`}
        onMouseEnter={handleMouseEnter("home")}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/">GraphCards</Link>
      </div>

      <div
        key={"playground"}
        onMouseEnter={handleMouseEnter("playground")}
        onMouseLeave={handleMouseLeave}
        className={`${styles.link}  ${
          (location === "/playground" || hoveredLink === "playground") &&
          styles.selectedColor
        }`}
      >
        <Link to="/playground">Lab</Link>
      </div>
    </div>
  );
}
