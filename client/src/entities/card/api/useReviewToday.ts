"use client";

import { useQuery } from "@tanstack/react-query";
import { cardApi } from "./cardApi";

export const reviewKeys = { today: ["review", "today"] as const };

export const useReviewToday = () =>
  useQuery({ queryKey: reviewKeys.today, queryFn: cardApi.today });
