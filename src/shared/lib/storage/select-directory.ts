import { Directory } from "expo-file-system";

export const selectDirectory = async (): Promise<Directory | null> => {
  return Directory.pickDirectoryAsync();
};
