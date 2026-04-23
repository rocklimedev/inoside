import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  History, Search, Filter, CheckCircle, Clock, RefreshCw, XCircle, ArrowRight
} from 'lucide-react';

const MODULES = ['all', 'Brief', 'Site Reki', 'Scope of Work', 'Time & Cost', 'BOQ', 'Design'];

const actionIcon = (a) => {
  if (!a) return <Clock className="w-3.5 h-3.5" />;
  const al = a.toLowerCase();
  if (al.includes('approved')) return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
  if (al.includes('rejected') || al.includes('changes')) return <XCircle className="w-3.5 h-3.5 text-[#e31d3b]" />;
  if (al.includes('revised') || al.includes('sent')) return <RefreshCw className="w-3.5 h-3.5 text-[#ef7f1b]" />;
  return <Clock className="w-3.5 h-3.5 text-gray-400" />;
};

const actionColor = (a) => {
  if (!a) return 'bg-gray-100 text-gray-600';
  const al = a.toLowerCase();
  if (al.includes('approved')) return 'bg-green-50 text-green-700';
  if (al.includes('rejected') || al.includes('changes')) return 'bg-red-50 text-[#e31d3b]';
  if (al.includes('revised') || al.includes('sent')) return 'bg-orange-50 text-[#ef7f1b]';
  return 'bg-gray-100 text-gray-600';
};

export default function RevisionLogsPage() {
  const { api } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [projects, setProjects] = useState([]);
  const [filterProject, setFilterProject] = useState('all');
  const [activeLog, setActiveLog] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/revision-logs/all'), api.get('/projects')])
      .then(([r, p]) => { setLogs(r.data); setProjects(p.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l => {
    if (search && !l.document?.toLowerCase().includes(search.toLowerCase()) && !l.project?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterModule !== 'all' && l.module !== filterModule) return false;
    if (filterProject !== 'all' && l.project !== filterProject) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  return (
    <div className="flex flex-col h-full" data-testid="revision-logs-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black text-black" data-testid="revision-logs-title">Revision Logs</h1>
            <p className="text-xs text-gray-400 mt-1">{logs.length} revision{logs.length !== 1 ? 's' : ''} tracked</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search revisions..." className="pl-10" data-testid="revision-search" />
          </div>
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-40 h-9 text-xs"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>{MODULES.map(m => <SelectItem key={m} value={m}>{m === 'all' ? 'All Modules' : m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-44 h-9 text-xs"><SelectValue placeholder="All Projects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16"><History className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No revision logs found</p></div>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="revision-table">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="py-2.5 px-3 text-left font-bold">Document</th>
                      <th className="py-2.5 px-3 text-left font-bold">Project</th>
                      <th className="py-2.5 px-3 text-left font-bold">Module</th>
                      <th className="py-2.5 px-3 text-left font-bold">Action</th>
                      <th className="py-2.5 px-3 text-left font-bold">By</th>
                      <th className="py-2.5 px-3 text-left font-bold">Date</th>
                      <th className="py-2.5 px-3 text-left font-bold">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log, i) => (
                      <tr key={`${log.id}-${i}`} className="border-t border-gray-100 hover:bg-gray-50/50 cursor-pointer" onClick={() => setActiveLog(log)} data-testid={`revision-row-${i}`}>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            {actionIcon(log.action)}
                            <span className="text-xs font-medium text-black truncate max-w-[180px]">{log.document}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-600">{log.project}</td>
                        <td className="py-2.5 px-3"><Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">{log.module}</Badge></td>
                        <td className="py-2.5 px-3"><Badge className={`${actionColor(log.action)} text-[9px] border-0`}>{log.action}</Badge></td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">{log.by || '—'}</td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">{log.date ? new Date(log.date).toLocaleDateString() : '—'}</td>
                        <td className="py-2.5 px-3 text-xs text-gray-400 truncate max-w-[150px]">{log.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      <Sheet open={!!activeLog} onOpenChange={(o) => { if (!o) setActiveLog(null); }}>
        <SheetContent className="w-[400px] p-0">
          {activeLog && (
            <div className="flex flex-col h-full" data-testid="revision-detail">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-black">{activeLog.document}</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">{activeLog.project} &middot; {activeLog.module}</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actionColor(activeLog.action)}`}>{actionIcon(activeLog.action)}</div>
                  <div>
                    <p className="text-xs font-bold text-black">{activeLog.action}</p>
                    <p className="text-[10px] text-gray-400">by {activeLog.by} &middot; {activeLog.date ? new Date(activeLog.date).toLocaleString() : '—'}</p>
                  </div>
                </div>
                {activeLog.note && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Note</p>
                    <p className="text-xs text-gray-700">{activeLog.note}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
