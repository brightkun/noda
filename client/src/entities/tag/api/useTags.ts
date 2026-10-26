"use client";

import { useQuery } from "@tanstack/react-query";
import { http } from "@/shared/api/http";
import { Tag } from "../model/types";

export const tagKeys = { all: ["tags"] as const };

export const useTags = () =>
  useQuery({
    queryKey: tagKeys.all,
    queryFn: async () => (await http.get<Tag[]>("/tags")).data,
  });
