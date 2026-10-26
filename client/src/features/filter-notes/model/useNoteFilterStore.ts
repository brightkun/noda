import { create } from "zustand";

type NoteFilterState = {
  query: string;
  tag: string | null;
  setQuery: (query: string) => void;
  // повторный клик по выбранному тегу снимает фильтр
  toggleTag: (tag: string) => void;
  clearTag: () => void;
};

export const useNoteFilterStore = create<NoteFilterState>((set) => ({
  query: "",
  tag: null,
  setQuery: (query) => set({ query }),
  toggleTag: (tag) =>
    set((state) => ({ tag: state.tag === tag ? null : tag })),
  clearTag: () => set({ tag: null }),
}));
