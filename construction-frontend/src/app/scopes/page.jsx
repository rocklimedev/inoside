import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Plus, FileText, Save, Download, ChevronDown, ChevronRight, Check,
  ClipboardList, Briefcase, Package, XCircle, Users, ArrowLeft, Loader2,
  Edit3, Trash2, Send
} from 'lucide-react';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const SECTIONS = [
  { id: 'services', title: 'Project Services', icon: Briefcase, fields: ['services'] },
  { id: 'coverage', title: 'Work Coverage', icon: ClipboardList, fields: ['work_coverage'] },
  { id: 'deliverables', title: 'Deliverables', icon: Package, fields: ['deliverables'] },
  { id: 'exclusions', title: 'Exclusions', icon: XCircle, fields: ['exclusions'] },
  { id: 'responsibilities', title: 'Client Responsibilities', icon: Users, fields: ['payment_timelines', 'material_approvals', 'decision_timelines'] },
];

const STATUS_MAP = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  completed: { label: 'Document Ready', color: 'bg-blue-50 text-blue-600' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-600' },
  changes_requested: { label: 'Changes Requested', color: 'bg-red-50 text-[#e31d3b]' },
};

export default function ScopePage() {
  const { api, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState('list');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => { fetch(); }, []);
  const fetch = async () => {
    try { const r = await api.get('/scopes'); setItems(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error('Project name required'); return; }
    try {
      const r = await api.post('/scopes', { project_name: newName });
      setItems(p => [...p, r.data]); setActive(r.data); setMode('form');
      setShowNew(false); setNewName(''); toast.success('Created');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/scopes/${id}`); setItems(p => p.filter(x => x.id !== id));
      if (active?.id === id) { setActive(null); setMode('list'); } toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const openItem = (item) => {
    setActive(item);
    setMode(user?.role === 'Client' ? 'document' : (item.document_generated ? 'document' : 'form'));
  };

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  if (mode === 'form' && active) return <ScopeForm item={active} api={api} onBack={() => { setMode('list'); fetch(); }} onGenerated={d => { setActive(d); setMode('document'); }} />;
  if (mode === 'document' && active) return <ScopeDocument item={active} api={api} user={user} onBack={() => { setMode('list'); fetch(); }} onEdit={() => setMode('form')} />;

  return (
    <div className="flex flex-col h-full" data-testid="scope-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-black text-black" data-testid="scope-title">Scope of Work</h1>
            <p className="text-xs text-gray-400 mt-1">{items.length} document{items.length !== 1 ? 's' : ''}</p></div>
          {user?.role !== 'Client' && (
            <Button onClick={() => setShowNew(true)} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" size="sm" data-testid="new-scope-btn">
              <Plus className="w-4 h-4 mr-1" /> New Scope
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1"><div className="p-4 md:p-6">
        {items.length === 0 ? (
          <div className="text-center py-20"><ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No scope documents yet.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => {
              const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
              return (
                <Card key={item.id} className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer" onClick={() => openItem(item)} data-testid={`scope-card-${i}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-black">{item.project_name}</h3>
                    <Badge className={`${st.color} text-[10px] border-0`}>{st.label}</Badge>
                  </div>
                  <p className="text-[10px] text-gray-400">By {item.created_by} &middot; {new Date(item.created_at).toLocaleDateString()}</p>
                  <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-gray-300 hover:text-[#e31d3b]"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div></ScrollArea>
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>New Scope of Work</DialogTitle></DialogHeader>
          <div className="py-2"><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Name *</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} className="mt-1" data-testid="new-scope-name" /></div>
          <DialogFooter><Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="new-scope-submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function ScopeForm({ item, api, onBack, onGenerated }) {
  const [form, setForm] = useState({ ...item });
  const [open, setOpen] = useState({ services: true });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const timer = useRef(null);

  const update = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save({ ...form, [k]: v }), 2000);
  };
  const save = async (d) => { setSaving(true); try { await api.put(`/scopes/${item.id}`, d || form); } catch {} finally { setSaving(false); } };
  const generate = async () => {
    setGenerating(true);
    try { await api.put(`/scopes/${item.id}`, form); await api.post(`/scopes/${item.id}/generate`);
      const u = await api.get(`/scopes/${item.id}`); toast.success('Document generated'); onGenerated(u.data);
    } catch { toast.error('Failed'); } finally { setGenerating(false); }
  };

  const allFields = SECTIONS.flatMap(s => s.fields);
  const filled = allFields.filter(f => form[f] && String(form[f]).trim()).length;
  const prog = Math.round((filled / allFields.length) * 100);

  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));

  const fieldMap = {
    services: <Textarea value={form.services || ''} onChange={e => update('services', e.target.value)} rows={4} placeholder="Architecture, Interior, Execution, Consultation..." />,
    work_coverage: <Textarea value={form.work_coverage || ''} onChange={e => update('work_coverage', e.target.value)} rows={4} placeholder="Design services, Site supervision, Vendor coordination, Material selection..." />,
    deliverables: <Textarea value={form.deliverables || ''} onChange={e => update('deliverables', e.target.value)} rows={4} placeholder="Concept design, Working drawings, Execution drawings, Site visits..." />,
    exclusions: <Textarea value={form.exclusions || ''} onChange={e => update('exclusions', e.target.value)} rows={4} placeholder="Items not included in the scope..." />,
    payment_timelines: <Textarea value={form.payment_timelines || ''} onChange={e => update('payment_timelines', e.target.value)} rows={2} placeholder="Payment schedule and milestones..." />,
    material_approvals: <Textarea value={form.material_approvals || ''} onChange={e => update('material_approvals', e.target.value)} rows={2} placeholder="Material approval process..." />,
    decision_timelines: <Textarea value={form.decision_timelines || ''} onChange={e => update('decision_timelines', e.target.value)} rows={2} placeholder="Decision turnaround expectations..." />,
  };

  return (
    <div className="flex flex-col h-full" data-testid="scope-form">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-base font-bold text-black">{form.project_name}</h1><p className="text-[11px] text-gray-400">Module: Scope of Work</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{saving ? 'Saving...' : 'Auto-saved'}</span>
            <Button variant="outline" size="sm" onClick={() => save()}><Save className="w-3.5 h-3.5 mr-1" /> Save</Button>
            <Button variant="outline" size="sm" onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <FileText className="w-3.5 h-3.5 mr-1" />} Generate
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3"><Progress value={prog} className="h-1.5 flex-1 bg-gray-100 progress-orange" /><span className="text-xs font-bold text-gray-500">{prog}%</span></div>
      </div>
      <ScrollArea className="flex-1"><div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const isOpen = open[s.id];
          const sF = s.fields.filter(f => form[f] && String(form[f]).trim()).length;
          const sP = Math.round((sF / s.fields.length) * 100);
          return (
            <Card key={s.id} className="overflow-hidden">
              <button onClick={() => toggle(s.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sP === 100 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#ef7f1b]'}`}>
                    {sP === 100 ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div><h3 className="text-sm font-bold text-black">{s.title}</h3><p className="text-[10px] text-gray-400">{sP}% complete</p></div>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
              {isOpen && <div className="px-4 pb-4 pt-1 border-t border-gray-100 animate-fadeInUp space-y-3">
                {s.fields.map(f => <div key={f}><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{f.replace(/_/g, ' ')}</Label><div className="mt-1">{fieldMap[f]}</div></div>)}
              </div>}
            </Card>
          );
        })}
      </div></ScrollArea>
    </div>
  );
}


function ScopeDocument({ item, api, user, onBack, onEdit }) {
  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
  const handleDownload = () => { if (item.document_url) window.open(`${BACKEND}${item.document_url}`, '_blank'); };

  const secs = [
    { title: 'Services Included', value: item.services },
    { title: 'Work Coverage', value: item.work_coverage },
    { title: 'Deliverables', value: item.deliverables },
    { title: 'Exclusions', value: item.exclusions },
    { title: 'Client Responsibilities', value: [item.payment_timelines, item.material_approvals, item.decision_timelines].filter(Boolean).join('\n\n') },
  ];

  return (
    <div className="flex flex-col h-full" data-testid="scope-document">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-base font-bold text-black">{item.project_name}</h1><p className="text-[11px] text-gray-400">Scope of Work</p></div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>{st.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {user?.role !== 'Client' && <Button variant="outline" size="sm" onClick={onEdit}><Edit3 className="w-3.5 h-3.5 mr-1" /> Edit</Button>}
            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-3.5 h-3.5 mr-1" /> Download PDF</Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 bg-gray-50"><div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b-2 border-[#ef7f1b]">
            <div className="flex items-baseline gap-1 mb-1"><span className="text-lg font-black text-black">BUILD</span><span className="text-lg font-black text-[#ef7f1b]">CON</span></div>
            <h2 className="text-2xl font-bold text-black mt-4">Scope of Work</h2>
            <p className="text-sm text-gray-500 mt-1">{item.project_name} &middot; {new Date(item.created_at).toLocaleDateString()}</p>
          </div>
          <div className="p-8 space-y-8">
            {secs.map((s, i) => (
              <div key={i}><h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-3">{i + 1}. {s.title}</h3>
                <p className="text-sm text-black whitespace-pre-wrap">{s.value || '—'}</p>
              </div>
            ))}
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center"><p className="text-[10px] text-gray-400">Generated by BUILDCON &middot; Confidential Document</p></div>
        </div>
      </div></ScrollArea>
    </div>
  );
}
