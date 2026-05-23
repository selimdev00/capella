import { titleCase } from "@/lib/format";
import type { UserStats } from "@/lib/query";
import { CountUp } from "./count-up";

// Pure CSS/SSR visuals - no charting library, so they paint with the first
// server response and ship zero client JS. Entrance animation + hover tooltips
// are CSS-only. Colours carry meaning.
const ROLE_COLOR: Record<string, string> = {
  Admin: "#f43f5e", // rose
  Moderator: "#f59e0b", // amber
  User: "#0ea5e9", // cyan / sky accent
};
const FEMALE = "#0ea5e9";
const MALE = "#8b5cf6";

function Panel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 p-4">
      <p className="text-muted-foreground mb-4 text-xs tracking-wide uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

const tooltipClass =
  "pointer-events-none absolute z-10 rounded-md border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md opacity-0 transition-opacity duration-150";

const pct = (n: number, total: number) =>
  total ? Math.round((n / total) * 100) : 0;

export function DashboardCharts({ stats }: { stats: UserStats }) {
  const roles = Object.entries(stats.byRole).map(([key, value]) => ({
    name: titleCase(key),
    value,
  }));
  const maxRole = Math.max(1, ...roles.map((r) => r.value));

  const female = stats.byGender.female ?? 0;
  const male = stats.byGender.male ?? 0;
  const total = female + male || 1;
  const femalePct = pct(female, total);

  return (
    <div className="bg-card grid grid-cols-1 divide-y rounded-lg border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <Panel label="Users by role">
        <div className="space-y-4">
          {roles.map((r, i) => {
            const color = ROLE_COLOR[r.name] ?? FEMALE;
            return (
              <div key={r.name} className="group/bar relative space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Dot color={color} />
                    {r.name}
                  </span>
                  <span className="text-muted-foreground font-mono tabular-nums">
                    <CountUp value={r.value} />
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bar-fill h-full rounded-full"
                    style={{
                      width: `${Math.round((r.value / maxRole) * 100)}%`,
                      background: color,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                </div>
                <div className={`${tooltipClass} -top-1 right-0 -translate-y-full group-hover/bar:opacity-100`}>
                  {r.name}: <span className="font-mono">{r.value}</span> (
                  {pct(r.value, stats.total)}%)
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel label="Gender split">
        <div className="group/donut relative flex items-center gap-6">
          <div
            className="donut-anim relative size-32 shrink-0 rounded-full"
            style={
              {
                background: `conic-gradient(${FEMALE} 0 var(--donut-p), ${MALE} var(--donut-p) 100%)`,
                "--donut-p": `${femalePct}%`,
                "--donut-target": `${femalePct}%`,
              } as React.CSSProperties
            }
            role="img"
            aria-label={`Female ${female}, male ${male}`}
          >
            <div className="bg-card absolute inset-[20%] grid place-items-center rounded-full">
              <span className="font-mono text-lg font-medium tabular-nums">
                <CountUp value={total} />
              </span>
            </div>
          </div>
          <ul className="flex-1 space-y-3">
            {[
              { name: "Female", value: female, color: FEMALE },
              { name: "Male", value: male, color: MALE },
            ].map((g, i) => (
              <li key={g.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Dot color={g.color} />
                    {g.name}
                  </span>
                  <span className="text-muted-foreground font-mono tabular-nums">
                    <CountUp value={g.value} /> · {pct(g.value, total)}%
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bar-fill h-full rounded-full"
                    style={{
                      width: `${pct(g.value, total)}%`,
                      background: g.color,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className={`${tooltipClass} top-0 left-0 group-hover/donut:opacity-100`}>
            Female {female} ({femalePct}%) · Male {male} ({100 - femalePct}%)
          </div>
        </div>
      </Panel>
    </div>
  );
}
