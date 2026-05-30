import { FieldGroup, TextInput, type ObservableState } from "@expo/ui";

type Props = {
  value: ObservableState<string>;
};

export function TitleSection({ value }: Props) {
  return (
    <FieldGroup.Section title="Title">
      <TextInput value={value} placeholder="Manga title" />
    </FieldGroup.Section>
  );
}
