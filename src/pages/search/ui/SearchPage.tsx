import { useState, useEffect, useRef, useCallback } from "react";
import {
  FlatList,
  ActivityIndicator,
  Platform,
  StyleSheet,
  type TextInput as RNTextInput,
} from "react-native";
import { View, Text, TextInput, SafeScreen } from "@/shared/ui";
import { Stack, useFocusEffect } from "expo-router";
import { mangaQueries } from "@/entities/manga";
import { MangaCard } from "@/entities/manga";
import { useInfiniteQuery } from "@tanstack/react-query";

const useNativeSearchBar =
  Platform.OS === "ios" && Number(Platform.Version) >= 26;

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const debouncedQuery = useDebounce(searchText, 400);
  const inputRef = useRef<RNTextInput>(null);

  useFocusEffect(
    useCallback(() => {
      if (!useNativeSearchBar) {
        inputRef.current?.focus();
      }
    }, []),
  );

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(mangaQueries.search(debouncedQuery));

  const mangaList = data?.pages.flatMap((page) => page.manga) ?? [];
  const paddedList =
    mangaList.length % 3 !== 0
      ? [...mangaList, ...Array(3 - (mangaList.length % 3)).fill(null)]
      : mangaList;

  const safeEdges: ("top" | "bottom")[] = useNativeSearchBar
    ? ["bottom"]
    : ["top", "bottom"];

  return (
    <>
      {useNativeSearchBar ? (
        <>
          <Stack.Screen
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerShadowVisible: false,
            }}
          />
          <Stack.SearchBar
            placement="automatic"
            placeholder="Search manga..."
            onChangeText={(e: any) => setSearchText(e.nativeEvent?.text ?? "")}
          />
        </>
      ) : (
        <Stack.Header hidden />
      )}

      <SafeScreen style={styles.container} edges={safeEdges}>
        {!useNativeSearchBar && (
          <View style={styles.searchBarWrapper}>
            <TextInput
              ref={inputRef}
              placeholder="Search manga..."
              value={searchText}
              onChangeText={setSearchText}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {!debouncedQuery ? (
          <View style={styles.empty}>
            <Text color="secondary" style={styles.emptyText}>
              Search for manga...
            </Text>
          </View>
        ) : isLoading ? (
          <View style={styles.empty}>
            <ActivityIndicator />
          </View>
        ) : error && !data ? (
          <View style={styles.empty}>
            <Text color="secondary" style={styles.emptyText}>
              An error occurred
            </Text>
          </View>
        ) : mangaList.length === 0 ? (
          <View style={styles.empty}>
            <Text color="secondary" style={styles.emptyText}>
              No results found for "{debouncedQuery}"
            </Text>
          </View>
        ) : (
          <FlatList
            data={paddedList}
            keyExtractor={(item, index) =>
              item ? String(item.malId) : `filler-${index}`
            }
            numColumns={3}
            renderItem={({ item }) =>
              item ? (
                <MangaCard manga={item} />
              ) : (
                <View style={styles.filler} />
              )
            }
            contentContainerStyle={styles.list}
            contentInsetAdjustmentBehavior="automatic"
            windowSize={3}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator style={styles.footer} />
              ) : null
            }
          />
        )}
      </SafeScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarWrapper: {
    padding: 12,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  list: {
    padding: 6,
  },
  filler: {
    flex: 1,
    margin: 4,
  },
  footer: {
    padding: 16,
  },
});
