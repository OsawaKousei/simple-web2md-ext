import { ReactNode } from 'react';

// ルートレイアウト - 基本的に空で、[locale]/layout.tsx に処理を委譲
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
