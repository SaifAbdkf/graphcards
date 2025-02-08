import { useEffect, useRef } from "react";
import { Edge, Network } from "vis-network";

export default function App() {
  const containerRef = useRef(null);
  useEffect(() => {
    const nodes = [
      { id: "1", label: "card1" },
      { id: "2", label: "card2" },
    ];

    const edges: Edge[] = [{ from: "1", to: "2" }];

    const data = { nodes, edges };
    const options = {
      physics: {
        enabled: true,
      },
      interaction: {
        hover: true,
      },
    };
    console.log(containerRef.current);
    let network: Network;
    if (containerRef.current !== null) {
      network =
        containerRef && new Network(containerRef.current, data, options);
    }
    return () => network.destroy(); // Clean up the network when the component unmounts
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "500px" }}>
      HI
    </div>
  );
}
