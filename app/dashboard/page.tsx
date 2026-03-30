import { DashboardClient } from "@/components/DashboardClient";
import { requireSessionUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireSessionUser();

  return (
    <DashboardClient
      initialUser={{
        name: user.name,
        username: user.username
      }}
    />
  );
}
