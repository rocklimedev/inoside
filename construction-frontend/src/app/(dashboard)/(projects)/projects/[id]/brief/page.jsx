export const dynamic = "force-dynamic";

import BriefPageClient from "./BriefPageClient";

export default function Page({ params }) {
  const id = params?.id;
  console.log("Project ID:", id); // Debugging log
  console.log("Params:", params); // Debugging log
  return <BriefPageClient projectId={id} />;
}
