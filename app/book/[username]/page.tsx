import { PublicBookingClient } from "@/components/PublicBookingClient";

export default async function PublicBookingPage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return <PublicBookingClient username={username} />;
}
