import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Eye, Download, Share2 } from 'lucide-react';

function StatusBadge({ status }) {
  const styles = {
    'Approved': 'bg-green-50 text-green-700 border-green-200',
    'Pending': 'bg-orange-50 text-[#ef7f1b] border-orange-200',
    'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
    'Revision Requested': 'bg-red-50 text-[#e31d3b] border-red-200',
  };
  return (
    <Badge className={`text-[10px] h-5 font-medium border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </Badge>
  );
}

export function PriorityActions({ actions }) {
  const getStatusColor = (status) => {
    if (status === 'Urgent' || status === 'Overdue') return 'bg-[#e31d3b]/10 text-[#e31d3b] border-[#e31d3b]/20';
    if (status === 'Due today') return 'bg-orange-50 text-[#ef7f1b] border-orange-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <Card className="p-5 md:p-6" data-testid="priority-actions">
      <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Priority Actions</h2>
      <ScrollArea className="h-[360px]">
        <div className="space-y-2.5">
          {actions.map((action, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-lg border border-gray-100 hover:border-[#ef7f1b]/30 hover:bg-orange-50/20 transition-all group"
            >
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-medium text-black leading-snug">{action.task}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-gray-400">{action.project_name}</span>
                  <Badge className={`text-[10px] px-1.5 py-0 h-[18px] font-medium border ${getStatusColor(action.due_status)}`}>
                    {action.due_status}
                  </Badge>
                </div>
              </div>
              <button
                className="px-3 py-1.5 text-[11px] font-bold text-[#ef7f1b] border border-[#ef7f1b]/30 rounded-md hover:bg-[#ef7f1b] hover:text-white transition-all opacity-0 group-hover:opacity-100 shrink-0"
                data-testid={`priority-cta-${i}`}
              >
                {action.cta}
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export function ApprovalsPanel({ approvals }) {
  return (
    <Card className="p-5 md:p-6" data-testid="approvals-panel">
      <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Approvals & Revisions</h2>
      <Tabs defaultValue="design">
        <TabsList className="w-full mb-4 bg-gray-50">
          <TabsTrigger
            value="design"
            className="flex-1 text-xs data-[state=active]:text-[#ef7f1b]"
            data-testid="approvals-design-tab"
          >
            Design Approvals
          </TabsTrigger>
          <TabsTrigger
            value="execution"
            className="flex-1 text-xs data-[state=active]:text-[#ef7f1b]"
            data-testid="approvals-execution-tab"
          >
            Execution Drawings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <ScrollArea className="h-[290px]">
            <div className="space-y-2.5">
              {approvals.design.map((item, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black">{item.project_name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="font-medium">{item.version}</span>
                    <span>{item.upload_date}</span>
                    <span>{item.revision_count} revision{item.revision_count !== 1 ? 's' : ''}</span>
                  </div>
                  {item.remarks && (
                    <p className="text-[11px] text-gray-500 mt-2 italic leading-relaxed">"{item.remarks}"</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="execution">
          <ScrollArea className="h-[290px]">
            <div className="space-y-2.5">
              {approvals.execution.map((item, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black">
                      {item.drawing_type} — {item.project_name}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>{item.area_ref}</span>
                    <span className="font-medium">{item.version}</span>
                    {item.has_revision_request && (
                      <Badge className="bg-[#e31d3b]/10 text-[#e31d3b] border-[#e31d3b]/20 text-[10px] h-[18px] border">
                        Revision Req.
                      </Badge>
                    )}
                  </div>
                  {item.comments && (
                    <p className="text-[11px] text-gray-500 mt-2 italic leading-relaxed">"{item.comments}"</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export function DocumentCenter({ documents }) {
  return (
    <Card className="p-5 md:p-6" data-testid="document-center">
      <h2 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Document Center</h2>
      <ScrollArea className="h-[360px]">
        <div className="space-y-1.5">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#ef7f1b]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black truncate">{doc.type}</p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                    <span className="truncate">{doc.project_name}</span>
                    <span className="shrink-0">{doc.version}</span>
                    <span className="shrink-0 hidden sm:inline">{doc.updated_by}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                <button className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors" data-testid={`doc-view-${i}`}>
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors" data-testid={`doc-download-${i}`}>
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
