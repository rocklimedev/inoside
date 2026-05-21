export const dynamic = "force-dynamic";

import BriefPageClient from "./BriefPageClient";

export default function Page({ params }) {
  const id = params?.id;

  return <BriefPageClient projectId={id} />;
}
