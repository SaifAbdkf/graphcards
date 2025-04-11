// import "./../main.css";

import { ReactNode } from "react";
import styles from "./Button.module.scss";
export type BgColorClass = "bg-red" | "bg-green" | "bg-neutral";
export type FontSizeClass =
  | "small-font-size"
  | "normal-fon-size"
  | "big-font-size";
export default function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  bgColorClass?: BgColorClass;
  fontSizeClass?: FontSizeClass;
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
