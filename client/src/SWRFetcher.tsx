import { ReactNode } from "react";

export default function SWRFetcher({ children }: { children: ReactNode }) {
  console.log("asbaton");
  return <>{children}</>;
}
