import { LocalMangaDetails } from "./LocalMangaDetails";
import { RemoteMangaDetails } from "./RemoteMangaDetails";

type Props =
  | { localId: string; malId: null }
  | { localId: null; malId: number };

export function MangaDetailsPage(props: Props) {
  if (props.localId !== null) {
    return <LocalMangaDetails localId={props.localId} />;
  }
  return <RemoteMangaDetails malId={props.malId} />;
}
