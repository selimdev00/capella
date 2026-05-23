"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <TriangleAlert className="text-destructive size-10" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t load this page. The upstream API may be unavailable.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
