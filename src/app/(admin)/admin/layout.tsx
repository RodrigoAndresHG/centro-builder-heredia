import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/permissions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdminRole(session.user.role)) {
    redirect("/app");
  }

  return <AdminShell>{children}</AdminShell>;
}
