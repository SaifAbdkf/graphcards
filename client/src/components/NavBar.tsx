import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useCallback, useState } from "react";
import { useLabView } from "../store/UISlice";
import { useActiveDeckInfo } from "../store/graphdecksDataSlice";
import { useTestDeck } from "../store/testSlice";

export default function NavBar() {
  const location = useLocation().pathname;
  const { labView } = useLabView();
  const activeDeckInfo = useActiveDeckInfo();
  const { testingDeckId } = useTestDeck();
  console.log(testingDeckId);

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
        graphcards
      </Link>
      <Link
        to={
          labView === "activeDeck" && activeDeckInfo !== null
            ? `/lab/${activeDeckInfo._id}`
            : "/lab/graphdecks"
        }
        onMouseEnter={handleMouseEnter("lab")}
        onMouseLeave={handleMouseLeave}
        className={`${styles.link}  ${
          (location.includes("/lab") && testingDeckId === null) ||
          (hoveredLink === "lab" && styles.selectedColor)
        }`}
      >
        <div>Library</div>
      </Link>
      {testingDeckId && <div className={`${styles.testing}`}>testing </div>}
    </div>
  );
}
