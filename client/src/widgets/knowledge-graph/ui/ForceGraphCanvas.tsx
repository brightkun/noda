"use client";

import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { ForceGraphMethods, ForceGraphProps } from "react-force-graph-2d";
import type { GraphNode } from "@/entities/graph";

// Обёртка нужна ради ref: через next/dynamic он теряется, а без него нельзя
// настроить силы и подогнать масштаб под граф
export default function ForceGraphCanvas(props: ForceGraphProps<GraphNode>) {
  const graphRef = useRef<ForceGraphMethods<GraphNode> | undefined>(undefined);
  const isFitted = useRef(false);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    graph.d3Force("charge")?.strength(-280);
    graph.d3Force("link")?.distance(100);
    graph.d3ReheatSimulation();
    isFitted.current = false;
  }, [props.graphData]);

  return (
    <ForceGraph2D
      ref={graphRef}
      {...props}
      // подгоняем масштаб один раз после раскладки, а не после каждого перетаскивания узла
      onEngineStop={() => {
        if (isFitted.current) return;
        isFitted.current = true;
        graphRef.current?.zoomToFit(400, 90);
      }}
    />
  );
}
