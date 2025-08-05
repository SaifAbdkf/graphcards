import { ReactFlowProvider } from "@xyflow/react";
import TestGraphdeck from "../components/TestGraphdeck";
import styles from "./TestPage.module.scss";

export default function TestPage() {
  return (
    <div className={`${styles.testPageContainer}`}>
      <div className={`${styles.testBar}`}> </div>
      <ReactFlowProvider>
        <TestGraphdeck />
      </ReactFlowProvider>
    </div>
  );
}
