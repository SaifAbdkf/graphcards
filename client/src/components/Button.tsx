import { ReactNode } from "react";
import styles from "./Button.module.scss";
export type BgColorClass = "bg-red" | "bg-green" | "bg-neutral";

export default function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  bgColorClass?: BgColorClass;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.theButton} ${disabled ? styles.disabled : ""}`}
    >
      {children}
    </button>
  );
}
