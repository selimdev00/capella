import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getUserById } from "@/lib/api/users";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleBadge } from "@/components/users/role-badge";
import { InfoCard, type InfoItem } from "@/components/users/info-card";
import { UserPosts } from "@/components/users/user-posts";
import { UserTodos } from "@/components/users/user-todos";
import { fullName, initials, maskCard, mapsUrl, titleCase } from "@/lib/format";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseId(id);
  const user = userId ? await getUserById(userId) : null;
  return { title: user ? fullName(user) : "User not found" };
}

function TabFallback() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = parseId(id);
  if (!userId) notFound();

  const user = await getUserById(userId);
  if (!user) notFound();

  const contact: InfoItem[] = [
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Username", value: `@${user.username}` },
    { label: "Birth date", value: user.birthDate ?? "-" },
  ];

  const coords = user.address.coordinates;
  const address: InfoItem[] = [
    { label: "Street", value: user.address.address },
    { label: "City", value: user.address.city },
    { label: "State", value: user.address.state },
    { label: "Postal code", value: user.address.postalCode },
    { label: "Country", value: user.address.country },
    {
      label: "Map",
      value: coords ? (
        <a
          href={mapsUrl(coords.lat, coords.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sky-600 hover:underline dark:text-sky-400"
        >
          Open <ExternalLink className="size-3.5" />
        </a>
      ) : (
        "-"
      ),
    },
  ];

  const company: InfoItem[] = [
    { label: "Company", value: user.company.name },
    { label: "Department", value: user.company.department },
    { label: "Title", value: user.company.title },
  ];

  const physical: InfoItem[] = [
    { label: "Age", value: user.age },
    { label: "Gender", value: titleCase(user.gender) },
    { label: "Height", value: user.height ? `${user.height} cm` : "-" },
    { label: "Weight", value: user.weight ? `${user.weight} kg` : "-" },
    { label: "Blood group", value: user.bloodGroup ?? "-" },
    {
      label: "Hair",
      value: user.hair ? `${user.hair.color}, ${user.hair.type}` : "-",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <Button variant="ghost" size="sm" render={<Link href="/" />}>
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Button>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarImage src={user.image} alt="" />
            <AvatarFallback className="text-xl">
              {initials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {fullName(user)}
              </h1>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-muted-foreground">
              @{user.username} · {user.company.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoCard title="Contact" items={contact} />
          <InfoCard title="Company" items={company} />
          <InfoCard title="Address" items={address} />
          <InfoCard title="Profile" items={physical} />
          {user.bank ? (
            <InfoCard
              title="Bank"
              items={[
                { label: "Card type", value: user.bank.cardType },
                { label: "Card number", value: maskCard(user.bank.cardNumber) },
                { label: "Currency", value: user.bank.currency },
                { label: "IBAN", value: user.bank.iban },
              ]}
            />
          ) : null}
        </div>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4">
            <Suspense fallback={<TabFallback />}>
              <UserPosts id={userId} />
            </Suspense>
          </TabsContent>
          <TabsContent value="todos" className="mt-4">
            <Suspense fallback={<TabFallback />}>
              <UserTodos id={userId} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </>
  );
}
