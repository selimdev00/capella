import type { UserStats } from "@/lib/query";
import { CountUp } from "./count-up";

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="min-w-0 flex-1 px-4 py-4 sm:px-5">
      <p className="text-muted-foreground truncate text-xs tracking-wide uppercase">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-medium tabular-nums sm:text-2xl">
        {value}
      </p>
      {sub ? (
        <p className="text-muted-foreground mt-0.5 truncate text-xs">{sub}</p>
      ) : null}
    </div>
  );
}

/** Compact summary strip - hairline-separated segments, monospace numerals. */
export function StatCards({ stats }: { stats: UserStats }) {
  const female = stats.byGender.female ?? 0;
  const male = stats.byGender.male ?? 0;

  return (
    <div className="bg-card grid grid-cols-2 divide-x divide-y rounded-lg border sm:grid-cols-4 sm:divide-y-0">
      <Stat label="Total users" value={<CountUp value={stats.total} />} />
      <Stat
        label="Average age"
        value={<CountUp value={stats.averageAge} />}
        sub="years"
      />
      <Stat
        label="Admins"
        value={<CountUp value={stats.byRole.admin ?? 0} />}
        sub={`Moderators ${stats.byRole.moderator ?? 0}`}
      />
      <Stat
        label="Gender (f / m)"
        value={
          <>
            <CountUp value={female} /> / <CountUp value={male} />
          </>
        }
        sub="female / male"
      />
    </div>
  );
}
