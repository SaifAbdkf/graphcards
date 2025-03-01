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
  bgColorClass = "bg-neutral",
  fontSizeClass = "small-font-size",
}: {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  bgColorClass?: BgColorClass;
  fontSizeClass?: FontSizeClass;
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.theButton} ${bgColorClass} ${fontSizeClass}`}
    >
      {children}
    </button>
  );
}
