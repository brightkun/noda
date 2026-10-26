import { Badge } from "@/shared/ui/badge";

export const TagList = ({ tags }: { tags: string[] }) => {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag}>
          <Badge variant="secondary">#{tag}</Badge>
        </li>
      ))}
    </ul>
  );
};
