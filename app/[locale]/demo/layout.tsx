import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Pages | Treido",
  description: "Demo and prototype pages for Treido marketplace",
  robots: "noindex, nofollow",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
