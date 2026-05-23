import Link from "next/link";
import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export default function UserNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <UserX className="text-muted-foreground size-10" />
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">User not found</h1>
          <p className="text-muted-foreground text-sm">
            No user exists with that id.
          </p>
        </div>
        <Button render={<Link href="/" />}>Back to dashboard</Button>
      </main>
    </>
  );
}
