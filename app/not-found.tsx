import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="size-10 text-sky-500" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button render={<Link href="/" />}>Back to dashboard</Button>
    </main>
  );
}
