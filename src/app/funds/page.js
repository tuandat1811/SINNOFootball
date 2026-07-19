import { requirePageUser, shellUser } from "@/lib/pageAuth";
import AppShell from "@/components/AppShell";
import ComingSoon from "@/components/ComingSoon";

export const dynamic = "force-dynamic";

export default async function FundsPage() {
  const user = await requirePageUser();
  return (
    <AppShell user={shellUser(user)}>
      <ComingSoon
        title="Funds"
        note="Fund collection arrives in the next update — request fees via QR and track who has paid."
      />
    </AppShell>
  );
}
