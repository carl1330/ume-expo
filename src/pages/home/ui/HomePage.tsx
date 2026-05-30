import { mangaQueries, MangaCard } from "@/entities/manga";
import { View, Text, SafeScreen } from "@/shared/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList } from "react-native";

export function HomePage() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(mangaQueries.topList());

  const mangaList = data?.pages.flatMap((page) => page.manga) ?? [];

  if (error && !data) return <Text>An error occured</Text>;
  if (isLoading) return <ActivityIndicator style={{ padding: 16 }} />;

  return (
    <SafeScreen edges={["top"]}>
      <FlatList
        data={
          mangaList.length % 3 !== 0
            ? [...mangaList, ...Array(3 - (mangaList.length % 3)).fill(null)]
            : mangaList
        }
        keyExtractor={(item, index) =>
          item ? String(item.malId) : `filler-${index}`
        }
        numColumns={3}
        renderItem={({ item }) =>
          item ? (
            <MangaCard manga={item} />
          ) : (
            <View style={{ flex: 1, margin: 4 }} />
          )
        }
        contentContainerStyle={{ padding: 4 }}
        style={{ flex: 1 }}
        windowSize={3}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ padding: 16 }} />
          ) : null
        }
      />
    </SafeScreen>
  );
}
