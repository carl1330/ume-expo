import { EditMangaMetadataPage } from "@/pages/edit-manga-metadata";
import { useLocalSearchParams } from "expo-router";

export default function EditMangaMetadataRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditMangaMetadataPage id={id} />;
}
