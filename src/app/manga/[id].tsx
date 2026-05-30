import { MangaDetailsPage } from "@/pages/manga";
import { useLocalSearchParams } from "expo-router";

export default function Manga() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (id.startsWith("mal_")) {
    return <MangaDetailsPage malId={parseInt(id.slice(4), 10)} localId={null} />;
  }
  return <MangaDetailsPage localId={id} malId={null} />;
}
