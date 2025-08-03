import styles from "./LabPage.module.scss";

import LabBar from "../components/LabBar";
import GraphDecksPage from "./GraphDecksPage";
import ActiveGraphDeck from "../components/ActiveGraphDeck";
import { ReactFlowProvider } from "@xyflow/react";
import { LabView } from "../Types/storeTypes";
import { useParams } from "react-router-dom";
import { useActiveDeckInfo } from "../store/graphdecksDataSlice";
import { useGraphcardsStore } from "../store/store";
import { useShallow } from "zustand/shallow";

export default function LabPage({ labView }: { labView: LabView }) {
  const { graphdeckId } = useParams();
  const activeDeckInfo = useActiveDeckInfo();
  const setActiveDeckInfo = useGraphcardsStore(
    useShallow((state) => state.setActiveDeckInfo)
  );

  // TODO: store replace activeDeckInfo with activeDeckId
  if (graphdeckId && !activeDeckInfo) {
    setActiveDeckInfo({
      _id: graphdeckId,
      name: "deck not found",
      description: "dummy 2",
    });
  }
  console.log("graphdeckid from page", graphdeckId);

  return (
    <div className={styles.labContainer}>
      <LabBar />
      <div className={`${styles.labContentContainer}`}>
        {labView === "graphdecks" ? (
          <GraphDecksPage />
        ) : (
          <ReactFlowProvider>
            <ActiveGraphDeck />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
