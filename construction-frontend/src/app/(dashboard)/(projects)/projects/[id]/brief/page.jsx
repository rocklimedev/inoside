// page.js

export const dynamic = "force-dynamic";

import BriefPageClient from "./BriefPageClient";

export default function Page({ params }) {
  return <BriefPageClient projectId={params.id} />;
}
