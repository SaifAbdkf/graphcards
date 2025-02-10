import { useEffect, useMemo, useRef, useState } from "react";
import { Edge, Network } from "vis-network";
import "./App.css";

export default function App() {
  const containerRef = useRef(null);
  const [network, setNetwork] = useState<Network | null>(null);

  const nodes = useMemo(
    () => [
      { id: "1", label: "card1" },
      { id: "2", label: "card2" },
      { id: "3", label: "card3" },
    ],
    []
  );

  useEffect(() => {
    const edges: Edge[] = [{ id: "as", from: "1", to: "2", label: "asba" }];

    const data = { nodes, edges };
    const options = {
      // autoResize: false,
      // clicktoUse: true,
      physics: {
        enabled: false,
      },
      interaction: {
        hover: true,
      },
    };
    if (containerRef.current !== null) {
      setNetwork(new Network(containerRef.current, data, options));
    }
    if (network) {
      return () => network.destroy(); // Clean up the network when the component unmounts
    }
  }, [nodes]);

  // const addCard = () => {
  //   // network.setData({ nodes: nodes2, edges });
  //   nodes.push({ id: "4", label: "card4" });
  //   network2 && console.log(nodes);
  // };

  return (
    <div className={"appContainer"}>
      <div ref={containerRef} className={"canvasContainer"}></div>
      <div className={"cardLab"}>
        <form>
          <div>
            <label htmlFor="word">word</label>
            <input type="text" id="word"></input>
            <label htmlFor="type">type</label>
            <select id="type">
              <option>noun</option>
              <option>verb</option>
              <option>adjective</option>
              <option>expression</option>
            </select>
          </div>
          <div>
            <label htmlFor="translation">translation</label>
            <input type="text" id="translation"></input>
          </div>
          <div>
            <label htmlFor="example">Example</label>
            <input type="text" id="example"></input>
          </div>
          <div>
            <label htmlFor="notes">notes</label>
            <textarea id="notes"></textarea>
          </div>
          <div>
            <label htmlFor="link">links</label>
            <div>
              <select>
                <option value="">card1</option>
                <option value="">card2</option>
              </select>
              <input type="text" id="relation"></input>
            </div>
          </div>
          <button>Create card</button>
        </form>
      </div>
    </div>
  );
}
