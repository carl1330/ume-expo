import { Alert } from "react-native";
import { Button, Host, Icon } from "@expo/ui";
import { useImportMangaDirectory } from "@/entities/manga/api/use-import-manga-directory";
import { useEffect } from "react";

interface ImportButtonProps {
  onSuccess: (uuid: string) => void;
  targetId?: string;
}

export function ImportButton({ onSuccess, targetId }: ImportButtonProps) {
  const { importDirectory, status, error, importedId } = useImportMangaDirectory(targetId);

  useEffect(() => {
    if (status === "success" && importedId) {
      onSuccess(importedId);
    }
  }, [status, importedId, onSuccess]);

  useEffect(() => {
    if (status === "error" && error) {
      Alert.alert("Import failed", error);
    }
  }, [status, error]);

  const isLoading = status === "validating" || status === "importing";

  return (
    <Host matchContents>
      <Button variant="text" onPress={importDirectory} disabled={isLoading}>
        <Icon name={isLoading ? "hourglass" : "plus"} />
      </Button>
    </Host>
  );
}
