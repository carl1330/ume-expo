import { mangaQueries } from "@/shared/api";
import { MangaCard } from "@/shared/ui/MangaCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ExplorePage() {
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
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <FlatList
        data={
          mangaList.length % 3 !== 0
            ? [...mangaList, ...Array(3 - (mangaList.length % 3)).fill(null)]
            : mangaList
        }
        keyExtractor={(item, index) =>
          item ? String(item.mal_id) : `filler-${index}`
        }
        numColumns={3}
        renderItem={({ item, index }) =>
          item ? (
            <MangaCard manga={item} index={index} />
          ) : (
            <View style={{ flex: 1, margin: 4 }} />
          )
        }
        contentContainerStyle={{ padding: 4 }}
        style={{ flex: 1 }}
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
    </SafeAreaView>
  );
}
