import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useCallback, useState } from "react";

export default function NavBar() {
  const location = useLocation().pathname;
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const handleMouseEnter = useCallback(
    (page: string): React.MouseEventHandler<HTMLAnchorElement> =>
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
      <Link
        to="/"
        className={`${styles.logo} ${
          (location === "/" || hoveredLink === "home") && styles.selectedColor
        }`}
        onMouseEnter={handleMouseEnter("home")}
        onMouseLeave={handleMouseLeave}
      >
        GraphCards
      </Link>
      <Link
        to="/lab"
        onMouseEnter={handleMouseEnter("lab")}
        onMouseLeave={handleMouseLeave}
        className={`${styles.link}  ${
          (location === "/lab" || hoveredLink === "lab") && styles.selectedColor
        }`}
      >
        <div key={"lab"}>Lab</div>
      </Link>
    </div>
  );
}
