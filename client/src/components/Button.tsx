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
  bgColorClass,
  fontSizeClass,
}: {
  children: ReactNode;
  bgColorClass: BgColorClass;
  fontSizeClass: FontSizeClass;
}) {
  return (
    <div className={`${styles.theButton} ${bgColorClass} ${fontSizeClass}`}>
      {children}
    </div>
  );
}
