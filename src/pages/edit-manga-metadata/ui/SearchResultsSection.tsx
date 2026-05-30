import type { Manga } from "@/entities/manga";
import { FieldGroup, Picker } from "@expo/ui";

type Props = {
  results: Manga[];
  selectedMalId: number | null;
  onSelect: (malId: number) => void;
};

export function SearchResultsSection({
  results,
  selectedMalId,
  onSelect,
}: Props) {
  return (
    <FieldGroup.Section title="Search results">
      <Picker
        selectedValue={selectedMalId ?? results[0].malId ?? 0}
        onValueChange={(value) => {
          const malId = typeof value === "number" ? value : Number(value);
          onSelect(malId);
        }}
      >
        {results.map((result) => (
          <Picker.Item
            key={result.malId ?? result.title}
            label={`${result.title} (${result.score ?? "—"})`}
            value={result.malId ?? 0}
          />
        ))}
      </Picker>
    </FieldGroup.Section>
  );
}
