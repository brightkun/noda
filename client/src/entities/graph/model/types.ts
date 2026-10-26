export type GraphNode = {
  id: number;
  title: string;
  tags: string[];
};

export type GraphLink = {
  source: number;
  target: number;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};
