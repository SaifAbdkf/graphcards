import styles from "./LabPage.module.scss";

import LabBar from "../components/LabBar";
import { useLabView } from "../store/UISlice";
import GraphDecksPage from "./GraphDecksPage";
import ActiveGraphDeck from "../components/ActiveGraphDeck";
import { ReactFlowProvider } from "@xyflow/react";

export default function LabPage() {
  const { labView } = useLabView();

  return (
    <div className={styles.labContainer}>
      <LabBar />

      {labView === "graphdecks" ? (
        <GraphDecksPage />
      ) : (
        <ReactFlowProvider>
          <ActiveGraphDeck />
        </ReactFlowProvider>
      )}
    </div>
  );
}
