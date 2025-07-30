import { Plus, Save } from "lucide-react";
import styles from "./LabBar.module.scss";
import {
  CardPayload,
  DbAction,
  LinkPayload,
  UpdateGraphPayload,
} from "../Types/storageManagementTypes";
import { useCallback, useState, useEffect } from "react";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { dummy } from "../utils/utils";
import { LabView } from "../Types/storeTypes";
import { useLabView } from "../store/UISlice";
import { useDatabaseType } from "../store/settingsSlice";
import { useSWRConfig } from "swr";

export default function LabBar() {
  const { mutate } = useSWRConfig();

  const [hovered, setHovered] = useState<string | null>(null);
  const activeDeckInfo = useGraphcardsStore(
    useShallow((state) => state.activeDeckInfo)
  );
  const { labView, setLabView } = useLabView();
  const { databaseType, setDatabaseType } = useDatabaseType();

  // React to database type changes and trigger mutate
  // for dev
  useEffect(() => {
    mutate("/decksInfo");
  }, [databaseType, mutate]);

  const changeDatabaseType = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDatabaseType(event.target.checked ? "local" : "cloud");
    },
    [setDatabaseType]
  );

  const handleSaveGraphDeck = useCallback(() => {
    const { nodes, edges, deletedNodes, deletedEdges } =
      useGraphcardsStore.getState();

    const editedAndCreatedCardsPayload: CardPayload[] = nodes
      .filter((card) => card.data.dbAction !== "none")
      .map((filteredCard) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dbAction, editMode, ...cardData } = filteredCard.data;
        return { dbAction, data: cardData };
      });

    const deletedCardsPayload: CardPayload[] = deletedNodes.map((node) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dbAction, editMode, ...cardData } = node.data;
      return { dbAction: "delete" as DbAction, data: cardData };
    });

    const cardsPayload = [
      ...editedAndCreatedCardsPayload,
      ...deletedCardsPayload,
    ];

    // For some reason BaseLink in React flow has data field optional so i have to validate every time tha it is not undefined
    const linksToUpdate = edges.filter(
      (link) => link.data !== undefined && link.data.dbAction !== "none"
    );
    const editedAndCreatedLinksPayload: LinkPayload[] = linksToUpdate
      .map((filteredLink) => {
        if (filteredLink.data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { dbAction, editMode, ...linkData } = filteredLink.data;
          return { dbAction, data: linkData };
        }
        return undefined;
      })
      .filter((link): link is LinkPayload => link !== undefined);

    const deletedLinksPayload: LinkPayload[] = deletedEdges
      .map((edge) => {
        if (edge.data) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { dbAction, editMode, ...linkData } = edge.data;
          return { dbAction: "delete" as DbAction, data: linkData };
        }
        return undefined;
      })
      .filter((link): link is LinkPayload => link !== undefined);

    const linksPayload = [
      ...editedAndCreatedLinksPayload,
      ...deletedLinksPayload,
    ];

    const updateGraphPayload: UpdateGraphPayload = {
      deckId:
        cardsPayload[0].data.deckId ||
        linksPayload[0].data.deckId ||
        activeDeckInfo?._id ||
        "DECKID SHOULD BE DEFINED HERE", //smelly af
      cards: cardsPayload,
      links: linksPayload,
    };
    console.log("save", updateGraphPayload);
  }, []);

  const handleLabViewChange = useCallback(
    (view: string): React.MouseEventHandler<HTMLDivElement> =>
      () => {
        setLabView(view as LabView);
      },
    [setLabView]
  );

  const handleMouseEnter = useCallback(
    (hoveredElement: string): React.MouseEventHandler<HTMLDivElement> =>
      () => {
        setHovered(hoveredElement);
      },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);
  return (
    <div className={`${styles.labBar}`}>
      <div className={`${styles.leftSideLabBar}`}>
        <div
          className={`${styles.graphdecksNavLink} ${
            (hovered === "graphdecksNavLink" || labView === "graphdecks") &&
            styles.hoveredColor
          } ${
            labView === "graphdecks" &&
            activeDeckInfo === null &&
            styles.noBorder
          }  `}
          onClick={handleLabViewChange("graphdecks")}
          onMouseEnter={handleMouseEnter("graphdecksNavLink")}
          onMouseLeave={handleMouseLeave}
        >
          GraphDecks
        </div>
        {activeDeckInfo !== null && (
          <div className={`${styles.activeDeckTools}`}>
            <div
              className={`${styles.selectedDeckName} ${
                (hovered === "deckName" || labView === "activeDeck") &&
                styles.hoveredColor
              } ${labView !== "activeDeck" && styles.noBorder} `}
              onClick={handleLabViewChange("activeDeck")}
              onMouseEnter={handleMouseEnter("deckName")}
              onMouseLeave={handleMouseLeave}
            >
              {activeDeckInfo.name}
            </div>
            {labView === "activeDeck" && (
              <div className={`${styles.addCardIconContainer}`}>
                <div
                  className={`${styles.addCardIconBox} ${
                    hovered === "addCardIcon" && styles.hoveredAddCardIcon
                  } `}
                  onMouseEnter={handleMouseEnter("addCardIcon")}
                  onMouseLeave={handleMouseLeave}
                  onClick={dummy}
                >
                  <Plus size={18} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`${styles.storageManagementTools}`}>
        <label>local storage</label>
        <input
          type="checkbox"
          checked={databaseType === "local"}
          onChange={changeDatabaseType}
        ></input>
        <div
          className={`${styles.exportIconContainer}`}
          onClick={handleSaveGraphDeck}
        >
          <Save />
        </div>
      </div>
    </div>
  );
}
