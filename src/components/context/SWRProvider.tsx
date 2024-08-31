"use client";

import { ReactNode } from "react";
import { Cache, SWRConfig } from "swr";

const cacheProvider: (cache: Readonly<Cache<any>>) => Cache<any> = (cache) =>
  new Map();

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig
      value={{
        provider: cacheProvider,
        fetcher: (url: string) =>
          fetch(url)
            .then((res) => res.json())
            .catch((err) => {
              console.error(err);
            }),
      }}
    >
      {children}
    </SWRConfig>
  );
};
