import { Database, GitBranch, Globe } from "lucide-react";

const links = [
  { href: "https://selim.services", label: "Portfolio", icon: Globe },
  {
    href: "https://github.com/selimdev00/capella",
    label: "Source",
    icon: GitBranch,
  },
  { href: "https://dummyjson.com/docs/users", label: "API", icon: Database },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary size-2 rounded-full shadow-[0_0_0_3px_var(--accent)]" />
            <span className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
              Capella
            </span>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm">
            Named for one of the brightest stars in the northern sky, long used
            to navigate by. Here it charts a course through 208 users, with the
            URL as your map.
          </p>
        </div>

        <div className="space-y-3 sm:text-right">
          <p className="text-muted-foreground text-sm">
            Designed and built by{" "}
            <a
              href="https://selim.services"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-medium underline-offset-4 hover:underline"
            >
              Selim Ataballyev
            </a>
          </p>
          <nav className="flex gap-4 sm:justify-end">
            {links.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
