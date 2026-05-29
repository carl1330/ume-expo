import createClient from "openapi-fetch";
import { jikanBaseUrl } from "@/shared/config";
import type { paths } from "./v1";

export const { GET } = createClient<paths>({ baseUrl: jikanBaseUrl });
