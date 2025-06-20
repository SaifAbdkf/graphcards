import { ReactNode } from "react";
import { useGraphcardsStore } from "./store/store";
import { useShallow } from "zustand/shallow";
import { useDeck } from "./hooks/useDeck";

export default function SWRFetcher({ children }: { children: ReactNode }) {
  const activeDeck = useGraphcardsStore(
    useShallow((state) => state.activeDeckInfo)
  );

  useDeck(activeDeck?._id || null);

  return <>{children}</>;
}
