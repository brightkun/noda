"use client";

import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http";
import { GraphData } from "../model/types";

export const useGraph = (tag: string | null) =>
  useQuery({
    queryKey: ["graph", tag] as const,
    queryFn: async () =>
      (await http.get<GraphData>("/graph", { params: tag ? { tag } : {} })).data,
  });
