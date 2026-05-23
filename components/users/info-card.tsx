import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface InfoItem {
  label: string;
  value: React.ReactNode;
}

export function InfoCard({
  title,
  items,
}: {
  title: string;
  items: InfoItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                {item.label}
              </dt>
              <dd className="mt-0.5 truncate font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
