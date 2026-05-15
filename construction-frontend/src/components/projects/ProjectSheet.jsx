import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Upload, Trash2 } from "lucide-react";
import { InfoRow } from "./InfoRow";

export function ProjectSheet({ project, onOpenChange, onDelete }) {
  if (!project) return null;

  return (
    <Sheet open={!!project} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] sm:w-[480px]">
        <SheetHeader>
          <SheetTitle>{project.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
            <InfoRow icon="User" label="Client" value={project.client_name} />
            <InfoRow icon="MapPin" label="Location" value={project.location} />
            <InfoRow icon="FileText" label="Type" value={project.type} />
            <InfoRow icon="Clock" label="Stage" value={project.stage} />
            <InfoRow
              icon="Calendar"
              label="Start Date"
              value={project.start_date}
            />
          </div>

          <Separator />

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Progress
            </p>
            <div className="flex items-center gap-4">
              <Progress value={project.progress} className="h-2.5" />
              <span className="font-bold text-lg">{project.progress}%</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" /> View Full Details
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" /> Upload Files
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-red-600 hover:bg-red-50"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
