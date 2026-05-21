export const dynamic = "force-dynamic";

import BriefPageClient from "./BriefPageClient";

export default async function Page({ params }) {
  const { id } = await params;

  console.log("Project ID:", id);

  return <BriefPageClient projectId={id} />;
}
