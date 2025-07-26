import styles from "./ContextMenuItem.module.scss";
import { ReactNode } from "react";

export default function ContextMenuItem({
  children,
  onClickItem,
}: {
  children: ReactNode;
  onClickItem: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div className={`${styles.iconContainer}`} onClick={onClickItem}>
      {children}
    </div>
  );
}
