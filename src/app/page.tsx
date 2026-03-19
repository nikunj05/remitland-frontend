// ============================================================
// Root page — redirects to /receivers as the default route
// ============================================================

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/receivers");
}
