import { FileDown, FileUp, Plus, Save } from "lucide-react";
import styles from "./LabBar.module.scss";
import {
  CardPayload,
  DbAction,
  DeckInfoPayload,
  LinkPayload,
  UpdateGraphPayload,
} from "../Types/storageManagementTypes";
import { useCallback } from "react";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { useDeck } from "../hooks/useDeck";
import { dummy } from "../utils/utils";

export default function LabBar() {
  const activeDeckInfo = useGraphcardsStore(
    useShallow((state) => state.activeDeckInfo)
  );
  const {
    data: selectedDeck,
    // error: errorDeck,
    isLoading: isLoadingDeck,
    // mutate: mutateDeck,
  } = useDeck(activeDeckInfo?._id || null);

  const handleSaveGraphDeck = useCallback(() => {
    const { activeDeckInfo, nodes, edges, deletedNodes, deletedEdges } =
      useGraphcardsStore.getState();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let deckInfoPayload: DeckInfoPayload = null;
    if (activeDeckInfo && activeDeckInfo.dbAction !== "none") {
      const { dbAction: deckInfoDbAction, ...deckInfoData } = activeDeckInfo;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      deckInfoPayload = {
        dbAction: deckInfoDbAction,
        data: deckInfoData,
      };
    }

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
      // deckInfo: deckInfoPayload, //todo: bring this back
      cards: cardsPayload,
      links: linksPayload,
    };
    console.log("save", updateGraphPayload);
  }, []);

  return (
    <div className={`${styles.labBar}`}>
      <div className={`${styles.leftSideLabBar}`}>
        <div className={`${styles.graphdecksNavLink}`}>GraphDecks</div>
        <div className={`${styles.activeDeckTools}`}>
          <div className={`${styles.selectedDeckName}`}>
            {selectedDeck?.name}
          </div>
          <div className={`${styles.addCardIconContainer}`}>
            <div className={`${styles.addCardIconBox}`} onClick={dummy}>
              <Plus size={18} />
            </div>
          </div>
          {/* <div className={`${styles.saveIconContainer}`}>
          <Save onClick={handleSaveGraphDeck}></Save>
          </div> */}
        </div>
      </div>
      <div className={`${styles.storageManagementTools}`}>
        <div className={`${styles.importIconContainer}`}>
          <FileDown />
        </div>
        <div className={`${styles.exportIconContainer}`}>
          <FileUp />
        </div>
      </div>
    </div>
  );
}
