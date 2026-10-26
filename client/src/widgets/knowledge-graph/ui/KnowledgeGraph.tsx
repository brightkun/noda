"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useGraph } from "@/entities/graph";
import { useElementSize } from "@/shared/lib/useElementSize";
import { Skeleton } from "@/shared/ui/skeleton";
import { colorByTag, GRAPH_PALETTES } from "../lib/graphColors";

// Библиотека трогает window, поэтому без SSR
const ForceGraph2D = dynamic(() => import("./ForceGraphCanvas"), {
  ssr: false,
});

// после того как граф начал считаться, source/target становятся объектами узлов
const idOf = (
  end: number | string | { id?: number | string } | undefined,
): number | undefined => {
  const id = typeof end === "object" ? end.id : end;

  return typeof id === "number" ? id : undefined;
};

export const KnowledgeGraph = ({ tag }: { tag: string | null }) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { ref, size } = useElementSize<HTMLDivElement>();
  const { data, isPending, isError } = useGraph(tag);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const palette = GRAPH_PALETTES[resolvedTheme === "light" ? "light" : "dark"];

  // Библиотека мутирует узлы и связи (добавляет x, y), поэтому отдаём копию:
  // иначе испортим данные в кэше React Query
  const graphData = useMemo(
    () =>
      data && {
        nodes: data.nodes.map((node) => ({ ...node })),
        links: data.links.map((link) => ({ ...link })),
      },
    [data],
  );

  const neighbors = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (const node of data?.nodes ?? []) map.set(node.id, new Set());
    for (const { source, target } of data?.links ?? []) {
      map.get(source)?.add(target);
      map.get(target)?.add(source);
    }
    return map;
  }, [data]);

  const isActive = (id: number | undefined) =>
    hoveredId === null ||
    id === hoveredId ||
    (id !== undefined && neighbors.get(hoveredId)?.has(id) === true);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Граф связей между заметками. Список заметок доступен в боковой панели."
      className="relative h-full w-full overflow-hidden"
    >
      {isPending && <Skeleton className="absolute inset-0 rounded-none" />}

      {isError && (
        <p role="alert" className="p-6 text-sm text-destructive">
          Не удалось загрузить граф. Запущен ли сервер на :5000?
        </p>
      )}

      {graphData && graphData.nodes.length === 0 && (
        <p className="p-6 text-sm text-muted-foreground">
          {tag ? `Нет заметок с тегом #${tag}.` : "Заметок пока нет."}
        </p>
      )}

      {graphData && graphData.nodes.length > 0 && size.width > 0 && (
        <ForceGraph2D
          width={size.width}
          height={size.height}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          cooldownTicks={120}
          nodeLabel={() => ""}
          linkColor={(link) =>
            isActive(idOf(link.source)) && isActive(idOf(link.target))
              ? hoveredId === null
                ? palette.link
                : palette.linkActive
              : palette.linkDim
          }
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeHover={(node) => setHoveredId(node?.id ?? null)}
          onNodeClick={(node) => router.push(`/notes/${node.id}`)}
          nodeCanvasObjectMode={() => "replace"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            if (node.x === undefined || node.y === undefined) return;

            const active = isActive(node.id);
            const degree = neighbors.get(node.id)?.size ?? 0;
            const radius = 4 + Math.min(degree, 8) * 0.9;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = active
              ? colorByTag(node.tags[0], palette.node)
              : palette.nodeDim;
            ctx.fill();

            if (globalScale < 0.7 && node.id !== hoveredId) return;

            ctx.font = `${12 / globalScale}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = active ? palette.text : palette.textDim;
            ctx.fillText(node.title, node.x, node.y + radius + 2 / globalScale);
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            if (node.x === undefined || node.y === undefined) return;

            const degree = neighbors.get(node.id)?.size ?? 0;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6 + Math.min(degree, 8) * 0.9, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
        />
      )}
    </div>
  );
};
