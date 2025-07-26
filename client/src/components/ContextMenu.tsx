import { ReactNode } from "react";
import styles from "./ContextMenu.module.scss";

export default function ContextMenu({ children }: { children: ReactNode }) {
  return <div className={`${styles.contextMenuContainer}`}>{children}</div>;
}
