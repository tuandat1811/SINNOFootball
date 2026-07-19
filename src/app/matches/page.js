import { requirePageUser, shellUser } from "@/lib/pageAuth";
import AppShell from "@/components/AppShell";
import ComingSoon from "@/components/ComingSoon";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const user = await requirePageUser();
  return (
    <AppShell user={shellUser(user)}>
      <ComingSoon
        title="Matches"
        note="Match voting arrives in the next update — propose date options and vote on when to play."
      />
    </AppShell>
  );
}
