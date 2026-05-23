import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ filters }: { filters?: React.ReactNode }) {
  return (
    <header className="bg-background/85 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="focus-visible:ring-ring group flex items-center gap-2 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="bg-primary size-2 rounded-full shadow-[0_0_0_3px_var(--accent)]" />
          <span className="font-mono text-sm font-semibold tracking-[0.2em] uppercase">
            Capella
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {filters ? (
        <div className="border-t">
          <div className="mx-auto w-full max-w-6xl px-4 py-2.5">{filters}</div>
        </div>
      ) : null}
    </header>
  );
}
