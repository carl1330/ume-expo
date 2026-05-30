import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

type Props = {
  client: QueryClient;
  children: ReactNode;
};

export const Providers = ({ client, children }: Props) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
