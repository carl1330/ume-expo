import { ReaderPage } from "@/pages/reader";
import { useLocalSearchParams } from "expo-router";

export default function Reader() {
  const { mangaId, volumeUuid } = useLocalSearchParams<{
    mangaId: string;
    volumeUuid: string;
  }>();

  return <ReaderPage mangaId={mangaId} volumeUuid={volumeUuid} />;
}
