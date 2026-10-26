export type NoteListItem = {
  id: number;
  title: string;
  createdAt: string;
  tags: string[];
};

export type NoteRef = {
  id: number;
  title: string;
};

export type Note = NoteListItem & {
  body: string;
  links: NoteRef[];
  backlinks: NoteRef[];
};

export type NoteInput = {
  title: string;
  body: string;
};
