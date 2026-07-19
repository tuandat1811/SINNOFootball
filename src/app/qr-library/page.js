import { requireAdminPage, shellUser } from "@/lib/pageAuth";
import AppShell from "@/components/AppShell";
import ComingSoon from "@/components/ComingSoon";

export const dynamic = "force-dynamic";

export default async function QrLibraryPage() {
  const admin = await requireAdminPage();
  return (
    <AppShell user={shellUser(admin)}>
      <ComingSoon
        title="QR Library"
        note="Save reusable bank / e-wallet QR codes here, then attach them to fund requests. Arrives with the Funds update."
      />
    </AppShell>
  );
}
