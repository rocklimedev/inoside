import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, Users, Package, AlertTriangle, MessageSquare } from 'lucide-react';

export function ActiveProjects({ projects }) {
  return (
    <Card className="p-5 md:p-6" data-testid="active-projects">
      <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Active Projects</h2>
      <ScrollArea className="h-[360px]">
        <div className="space-y-3">
          {projects.map((project, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-black">{project.name}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {project.client_name} &middot; {project.type}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b] transition-colors shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] h-[18px] border font-medium">
                  {project.stage}
                </Badge>
                <span className="text-[11px] text-gray-400">{project.last_activity}</span>
                {project.has_issues && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e31d3b]" title="Has issues" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={project.completion} className="h-1.5 flex-1 bg-gray-100 progress-orange" />
                <span className="text-[11px] font-bold text-gray-500 w-8 text-right">{project.completion}%</span>
              </div>
              {project.pending_approvals > 0 && (
                <p className="text-[10px] text-[#ef7f1b] font-medium mt-2">
                  {project.pending_approvals} pending approval{project.pending_approvals > 1 ? 's' : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export function SiteProgress({ data }) {
  return (
    <Card className="p-5 md:p-6" data-testid="site-progress">
      <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Site Progress</h2>
      <ScrollArea className="h-[320px]">
        <div className="space-y-3">
          {data.map((site, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-black">{site.project_name}</h3>
                <Badge
                  className={`text-[10px] h-[18px] font-medium border ${
                    site.quality_status === 'Excellent'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : site.quality_status === 'Good'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-orange-50 text-[#ef7f1b] border-orange-200'
                  }`}
                >
                  {site.quality_status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Progress value={site.completion} className="h-1.5 flex-1 bg-gray-100 progress-orange" />
                <span className="text-[11px] font-bold text-gray-500 w-8 text-right">{site.completion}%</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{site.manpower} crew</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Package className="w-3 h-3" />
                  <span>{site.materials?.split(',')[0]}</span>
                </div>
                {site.issues > 0 && (
                  <div className="flex items-center gap-1.5 text-[#e31d3b]">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{site.issues} issue{site.issues > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2.5 italic">Today: {site.work_today}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export function ClientComms({ data }) {
  return (
    <Card className="p-5 md:p-6" data-testid="client-comms">
      <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Client Communication</h2>
      <ScrollArea className="h-[320px]">
        <div className="space-y-3">
          {data.map((comm, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-black">{comm.project_name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <MessageSquare className="w-3 h-3" />
                  <span>{comm.comm_preference}</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mb-2.5">Client: {comm.client_name}</p>
              <div className="space-y-1.5 text-[11px]">
                <p className="text-gray-500">
                  <span className="font-semibold text-gray-700">Remarks: </span>
                  {comm.recent_remarks}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold text-gray-700">Decision: </span>
                  {comm.approval_decisions}
                </p>
                {comm.special_requirements && (
                  <p className="text-[#ef7f1b]">
                    <span className="font-semibold">Note: </span>
                    {comm.special_requirements}
                  </p>
                )}
              </div>
              {comm.pending_responses > 0 && (
                <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px] border font-medium mt-2.5">
                  {comm.pending_responses} pending response{comm.pending_responses > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export function AlertsPanel({ alerts }) {
  const getSeverityStyle = (severity) => {
    if (severity === 'high') return 'border-l-[#e31d3b] bg-red-50/40';
    if (severity === 'medium') return 'border-l-[#ef7f1b] bg-orange-50/30';
    return 'border-l-gray-300 bg-gray-50/30';
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'high') return 'text-[#e31d3b]';
    if (severity === 'medium') return 'text-[#ef7f1b]';
    return 'text-gray-400';
  };

  return (
    <Card className="p-5 md:p-6" data-testid="alerts-panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">Alerts & Attention Required</h2>
        <Badge className="bg-[#e31d3b] text-white text-[10px] h-5 border-0">
          {alerts.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3.5 rounded-lg border-l-[3px] border border-gray-100 ${getSeverityStyle(alert.severity)} transition-all hover:shadow-sm`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <AlertTriangle className={`w-4 h-4 shrink-0 ${getSeverityIcon(alert.severity)}`} />
              <div className="min-w-0">
                <p className="text-sm text-black leading-snug">{alert.message}</p>
                <span className="text-[11px] text-gray-400">{alert.project_name}</span>
              </div>
            </div>
            <button
              className="ml-3 text-[11px] font-bold text-[#ef7f1b] hover:underline whitespace-nowrap"
              data-testid={`alert-action-${i}`}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
