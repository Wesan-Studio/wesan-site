'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ContentBundle } from './content';

const ContentContext = createContext<ContentBundle | null>(null);

export function ContentProvider({
  value,
  children,
}: {
  value: ContentBundle;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** Nav/footer client components - same bundle the server resolved (Helm + fallback). */
export function useContent(): ContentBundle {
  const value = useContext(ContentContext);
  if (!value) {
    throw new Error('useContent() requires <ContentProvider> in root layout');
  }
  return value;
}
