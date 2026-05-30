import type { JikanPreview } from "@/entities/manga";
import { FieldGroup, ListItem } from "@expo/ui";

type Props = {
  preview: JikanPreview;
};

export function JikanPreviewSection({ preview }: Props) {
  return (
    <FieldGroup.Section title="Preview">
      <ListItem supportingText={preview.score?.toString() ?? "—"}>
        Score
      </ListItem>
      <ListItem supportingText={preview.status ?? "—"}>Status</ListItem>
      <ListItem
        supportingText={
          preview.authors.length
            ? preview.authors.map((a) => a.name).join(", ")
            : "—"
        }
      >
        Authors
      </ListItem>
    </FieldGroup.Section>
  );
}
