"use client";

import { useSearchParams } from "next/navigation";
import {
  useGetExecutionStagesQuery,
  useGetExecutionActivitiesQuery,
} from "@/api/projects/executionApi";
import ExecutionWorkspace from "@/components/execution/ExecutionWorkspace";
export default function ExecutionPage() {
  const searchParams = useSearchParams();

  const projectId = searchParams.get("project_id");

  const {
    data: stages = [],
    isLoading: stagesLoading,
    refetch: refetchStages,
  } = useGetExecutionStagesQuery(projectId, {
    skip: !projectId,
  });

  const {
    data: activities = [],
    isLoading: activitiesLoading,
    refetch: refetchActivities,
  } = useGetExecutionActivitiesQuery(projectId, {
    skip: !projectId,
  });

  if (!projectId) {
    return <div className="p-6">No project selected</div>;
  }

  if (stagesLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <ExecutionWorkspace
      projectId={projectId}
      stages={stages}
      activities={activities}
      refetchStages={refetchStages}
      refetchActivities={refetchActivities}
    />
  );
}
