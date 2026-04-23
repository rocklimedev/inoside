import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
    Building2, ArrowLeft, Search, Loader2, AlertTriangle, CheckCircle, Clock,
    Camera, Truck, Users, Package, MessageSquare, Plus, Send
} from 'lucide-react';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function SiteCoordinationPage() {
    const { api, user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/projects').then(r => setProjects(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

    if (selectedProject) return <SiteWorkspace project={selectedProject} api={api} user={user} onBack={() => setSelectedProject(null)} />;

    return (
        <div className="flex flex-col h-full" data-testid="site-coord-page">
            <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
                <h1 className="text-xl font-black text-black" data-testid="site-coord-title">Site Coordination</h1>
                <p className="text-xs text-gray-400 mt-1">Select a project for site updates</p>
            </div>
            <div className="p-4 md:p-6">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="pl-10" data-testid="site-project-search" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projects.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
                        <Card key={p.id} className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer" onClick={() => setSelectedProject(p)} data-testid={`site-project-${i}`}>
                            <h3 className="text-sm font-bold text-black">{p.name}</h3>
                            <p className="text-[10px] text-gray-400 mt-1">{p.client_name} &middot; {p.stage}</p>
                            {p.location && <p className="text-[10px] text-gray-400">{p.location}</p>}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SiteWorkspace({ project, api, user, onBack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('today');
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        Promise.all([
            api.get(`/site-coordination/${project.id}`),
            api.get(`/site-coordination/notes/${project.id}`)
        ]).then(([d, n]) => { setData(d.data); setNotes(n.data); })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const addNote = async () => {
        if (!newNote.trim()) return;
        try {
            const r = await api.post('/site-coordination/notes', { project_id: project.id, content: newNote });
            setNotes(p => [r.data, ...p]); setNewNote(''); toast.success('Note added');
        } catch { toast.error('Failed'); }
    };

    if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

    const d = data || {};

    return (
        <div className="flex flex-col h-full" data-testid="site-workspace">
            <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
                    <div><h1 className="text-base font-bold text-black">{project.name}</h1><p className="text-[11px] text-gray-400">Site Coordination</p></div>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
                {[
                    { label: 'Manpower', value: d.manpower || '—', icon: Users },
                    { label: 'Active Tasks', value: d.active_tasks?.length || 0, icon: CheckCircle },
                    { label: 'Open Issues', value: d.open_issues?.length || 0, icon: AlertTriangle },
                    { label: 'Pending Deliveries', value: d.pending_deliveries?.length || 0, icon: Truck },
                    { label: 'Site Stage', value: d.site_info?.stage || project.stage, icon: Building2 },
                ].map((k, i) => {
                    const Icon = k.icon;
                    return (
                        <Card key={i} className="p-3 text-center" data-testid={`site-kpi-${i}`}>
                            <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm font-black text-black truncate">{k.value}</p>
                            <p className="text-[9px] text-gray-400">{k.label}</p>
                        </Card>
                    );
                })}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="mx-4 mt-3 bg-gray-100 p-0.5 rounded-lg w-fit">
                    <TabsTrigger value="today" className="text-xs px-3 py-1.5">Today at Site</TabsTrigger>
                    <TabsTrigger value="updates" className="text-xs px-3 py-1.5">Site Updates</TabsTrigger>
                    <TabsTrigger value="issues" className="text-xs px-3 py-1.5">Issues</TabsTrigger>
                    <TabsTrigger value="materials" className="text-xs px-3 py-1.5">Materials</TabsTrigger>
                    <TabsTrigger value="notes" className="text-xs px-3 py-1.5">Notes</TabsTrigger>
                </TabsList>

                {/* Today */}
                <TabsContent value="today" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full"><div className="p-4 max-w-3xl space-y-4">
                        {d.today_report ? (
                            <Card className="p-4" data-testid="today-report">
                                <h3 className="text-sm font-bold text-black mb-3">Today's Report</h3>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Work Executed</p><p className="text-black mt-0.5">{d.today_report.work_executed || '—'}</p></div>
                                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Manpower</p><p className="text-black mt-0.5">{d.today_report.manpower_count || '—'}</p></div>
                                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Materials Used</p><p className="text-black mt-0.5">{d.today_report.materials_used || '—'}</p></div>
                                    <div><p className="text-[10px] font-bold text-gray-400 uppercase">Progress</p><p className="text-black mt-0.5">{d.today_report.completion_pct}%</p></div>
                                </div>
                                {d.today_report.issues_faced && (
                                    <div className="mt-3 p-2 bg-red-50 rounded-lg"><p className="text-[10px] font-bold text-[#e31d3b] uppercase">Issues</p><p className="text-xs text-gray-700 mt-0.5">{d.today_report.issues_faced}</p></div>
                                )}
                            </Card>
                        ) : (
                            <Card className="p-6 text-center"><Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-xs text-gray-400">No report for today yet</p></Card>
                        )}
                        {d.active_tasks?.length > 0 && (
                            <Card className="p-4">
                                <h3 className="text-sm font-bold text-black mb-3">Active Tasks ({d.active_tasks.length})</h3>
                                <div className="space-y-2">{d.active_tasks.map((t, i) => (
                                    <div key={t.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg" data-testid={`active-task-${i}`}>
                                        <div className={`w-2 h-2 rounded-full ${t.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                        <span className="text-xs text-black flex-1">{t.title}</span>
                                        <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">{t.status}</Badge>
                                    </div>
                                ))}</div>
                            </Card>
                        )}
                    </div></ScrollArea>
                </TabsContent>

                {/* Updates */}
                <TabsContent value="updates" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full"><div className="p-4 max-w-3xl">
                        {(!d.recent_reports || d.recent_reports.length === 0) ? (
                            <div className="text-center py-16"><Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No site updates yet</p></div>
                        ) : (
                            <div className="space-y-3">
                                {d.recent_reports.map((r, i) => (
                                    <Card key={r.id} className="p-4" data-testid={`update-${i}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-bold text-black">{r.date}</h4>
                                            <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">{r.completion_pct}%</Badge>
                                        </div>
                                        <p className="text-xs text-gray-600">{r.work_executed}</p>
                                        {r.progress_notes && <p className="text-[10px] text-gray-400 mt-1">{r.progress_notes}</p>}
                                        <div className="flex gap-2 mt-2 text-[10px] text-gray-400">
                                            {r.manpower_count && <span><Users className="w-3 h-3 inline" /> {r.manpower_count}</span>}
                                            {r.materials_used && <span><Package className="w-3 h-3 inline" /> {r.materials_used}</span>}
                                        </div>
                                        {r.site_photos?.length > 0 && (
                                            <div className="flex gap-2 mt-2">{r.site_photos.map((p, pi) => <img key={pi} src={`${BACKEND}${p}`} alt="" className="w-16 h-16 rounded object-cover border" />)}</div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div></ScrollArea>
                </TabsContent>

                {/* Issues */}
                <TabsContent value="issues" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full"><div className="p-4 space-y-2 max-w-3xl">
                        {(!d.all_issues || d.all_issues.length === 0) ? (
                            <div className="text-center py-16"><AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No issues reported</p></div>
                        ) : d.all_issues.map((iss, i) => (
                            <Card key={iss.id} className="p-3 flex items-center gap-3" data-testid={`site-issue-${i}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iss.status === 'open' ? 'bg-red-50 text-[#e31d3b]' : 'bg-green-50 text-green-600'}`}>
                                    {iss.status === 'open' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-black truncate">{iss.description}</h4>
                                    <p className="text-[10px] text-gray-400">{iss.responsible_party} {iss.target_date ? `· Due ${iss.target_date}` : ''}</p>
                                </div>
                                <Badge className={iss.status === 'open' ? 'bg-red-50 text-[#e31d3b] border-0' : 'bg-green-50 text-green-700 border-0'}>{iss.status}</Badge>
                            </Card>
                        ))}
                    </div></ScrollArea>
                </TabsContent>

                {/* Materials */}
                <TabsContent value="materials" className="flex-1 overflow-hidden m-0">
                    <ScrollArea className="h-full"><div className="p-4 max-w-3xl space-y-4">
                        {d.pending_deliveries?.length > 0 && (
                            <Card className="p-4">
                                <h3 className="text-sm font-bold text-black mb-3">Pending Deliveries ({d.pending_deliveries.length})</h3>
                                <div className="space-y-2">{d.pending_deliveries.map((pd, i) => (
                                    <div key={pd.id} className="flex items-center gap-2 p-2 bg-yellow-50/50 rounded-lg" data-testid={`pending-del-${i}`}>
                                        <Package className="w-4 h-4 text-[#ef7f1b]" />
                                        <span className="text-xs text-black flex-1">{pd.material_name}</span>
                                        <span className="text-[10px] text-gray-400">{pd.quantity_purchased} {pd.unit}</span>
                                        <Badge className="bg-yellow-50 text-yellow-700 text-[9px] border-0">Pending</Badge>
                                    </div>
                                ))}</div>
                            </Card>
                        )}
                        {d.recent_dispatches?.length > 0 && (
                            <Card className="p-4">
                                <h3 className="text-sm font-bold text-black mb-3">Recent Dispatches</h3>
                                <div className="space-y-2">{d.recent_dispatches.map((dp, i) => (
                                    <div key={dp.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg" data-testid={`dispatch-${i}`}>
                                        <Truck className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs text-black flex-1">{dp.material_name}</span>
                                        <span className="text-[10px] text-gray-400">{dp.quantity} units</span>
                                        <Badge className={dp.delivery_confirmed ? 'bg-green-50 text-green-700 border-0' : 'bg-blue-50 text-blue-600 border-0'}>{dp.delivery_confirmed ? 'Delivered' : 'In Transit'}</Badge>
                                    </div>
                                ))}</div>
                            </Card>
                        )}
                        {(!d.pending_deliveries?.length && !d.recent_dispatches?.length) && (
                            <div className="text-center py-16"><Truck className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No material movements</p></div>
                        )}
                    </div></ScrollArea>
                </TabsContent>

                {/* Notes */}
                <TabsContent value="notes" className="flex-1 overflow-hidden m-0">
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex gap-2">
                                <Input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add coordination note..." className="flex-1" data-testid="site-note-input"
                                    onKeyDown={e => { if (e.key === 'Enter') addNote(); }} />
                                <Button onClick={addNote} size="sm" className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="add-site-note"><Send className="w-4 h-4" /></Button>
                            </div>
                        </div>
                        <ScrollArea className="flex-1"><div className="p-4 space-y-2 max-w-3xl">
                            {notes.length === 0 ? (
                                <div className="text-center py-16"><MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No notes yet</p></div>
                            ) : notes.map((n, i) => (
                                <Card key={n.id} className="p-3" data-testid={`site-note-${i}`}>
                                    <p className="text-xs text-black">{n.content}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{n.created_by} &middot; {n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
                                </Card>
                            ))}
                        </div></ScrollArea>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
