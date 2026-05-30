import {
  FieldGroup,
  Icon,
  ListItem,
  TextInput,
  type ObservableState,
} from "@expo/ui";

type Props = {
  titleQuery: ObservableState<string>;
  malId: ObservableState<string>;
  onSearch: () => void;
  onFetchById: () => void;
  isSearching: boolean;
  isFetchingById: boolean;
};

export function MalLookupSection({
  titleQuery,
  malId,
  onSearch,
  onFetchById,
  isSearching,
  isFetchingById,
}: Props) {
  return (
    <FieldGroup.Section title="MyAnimeList">
      <TextInput value={titleQuery} placeholder="Manga name" />
      <ListItem
        onPress={onSearch}
        trailing={
          <Icon name={isSearching ? "hourglass" : "magnifyingglass"} />
        }
      >
        Search MAL
      </ListItem>
      <TextInput value={malId} placeholder="MAL ID" keyboardType="number-pad" />
      <ListItem
        onPress={onFetchById}
        trailing={
          <Icon name={isFetchingById ? "hourglass" : "arrow.down.circle"} />
        }
      >
        Fetch from MAL
      </ListItem>
    </FieldGroup.Section>
  );
}
