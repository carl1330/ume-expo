export interface DictionaryInfo {
  id: string;
  index: DictionaryIndex;
  path: string;
  isEnabled: boolean;
  order: number;
}

export interface DictionaryConfig {
  termDictionaries: DictionaryEntry[];
  frequencyDictionaries: DictionaryEntry[];
  pitchDictionaries: DictionaryEntry[];
}

export interface DictionaryEntry {
  fileName: string;
  isEnabled: boolean;
  order: number;
}

export interface DictionaryIndex {
  title: string;
  format: number;
  revision: string;
  isUpdatable: boolean;
  indexUrl: string;
  downloadUrl: string;
}

export interface AudioSource {
  id: string;
  name: string;
  url: string;
  isEnabled: boolean;
  isDefault: boolean;
}
