import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Plus, FileText, Send, Save, Download, ChevronDown, ChevronRight, Check,
  User, Phone, Mail, MapPin, MessageSquare, Home, Ruler, Clock, Users,
  Heart, Palette, Lightbulb, DollarSign, Image, Link, ThumbsUp, ThumbsDown,
  Loader2, ArrowLeft, Eye, Edit3, CheckCircle, AlertCircle, X, Trash2
} from 'lucide-react';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const SECTIONS = [
  { id: 'client', title: 'Client Information', icon: User, fields: ['client_name', 'client_phone', 'client_email', 'client_location', 'comm_preference'] },
  { id: 'project', title: 'Project Overview', icon: Home, fields: ['project_type', 'project_address', 'project_area', 'timeline_expectations'] },
  { id: 'lifestyle', title: 'Client Lifestyle & Needs', icon: Heart, fields: ['family_members', 'usage_requirements', 'special_needs', 'future_expansion'] },
  { id: 'design', title: 'Design Preferences', icon: Palette, fields: ['design_style', 'material_preferences', 'lighting_preference', 'color_preferences'] },
  { id: 'budget', title: 'Budget Understanding', icon: DollarSign, fields: ['budget_range', 'budget_flexibility', 'priority_areas', 'cost_optimization_areas'] },
  { id: 'references', title: 'References & Inspirations', icon: Image, fields: ['reference_links', 'client_likes', 'client_dislikes'] },
];

const STATUS_MAP = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  completed: { label: 'Document Ready', color: 'bg-blue-50 text-blue-600' },
  sent_to_client: { label: 'Sent to Client', color: 'bg-orange-50 text-[#ef7f1b]' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-600' },
  changes_requested: { label: 'Changes Requested', color: 'bg-red-50 text-[#e31d3b]' },
};

export default function BriefPage() {
  const { api, user } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBrief, setActiveBrief] = useState(null);
  const [mode, setMode] = useState('list'); // list | form | document | client-view
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => { fetchBriefs(); }, []);

  const fetchBriefs = async () => {
    try { const res = await api.get('/briefs'); setBriefs(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newProjectName.trim()) { toast.error('Project name required'); return; }
    try {
      const res = await api.post('/briefs', { project_name: newProjectName });
      setBriefs(prev => [...prev, res.data]);
      setActiveBrief(res.data);
      setMode('form');
      setShowNewDialog(false);
      setNewProjectName('');
      toast.success('Brief created');
    } catch (err) { toast.error('Failed to create brief'); }
  };

  const handleDelete = async (bid) => {
    try {
      await api.delete(`/briefs/${bid}`);
      setBriefs(prev => prev.filter(b => b.id !== bid));
      if (activeBrief?.id === bid) { setActiveBrief(null); setMode('list'); }
      toast.success('Brief deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  const openBrief = (brief) => {
    setActiveBrief(brief);
    if (user?.role === 'Client') {
      setMode(brief.document_generated ? 'client-view' : 'client-view');
    } else {
      setMode(brief.document_generated ? 'document' : 'form');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  if (mode === 'form' && activeBrief) return <BriefForm brief={activeBrief} api={api} user={user} onBack={() => { setMode('list'); fetchBriefs(); }} onGenerated={(b) => { setActiveBrief(b); setMode('document'); }} />;
  if (mode === 'document' && activeBrief) return <BriefDocument brief={activeBrief} api={api} user={user} onBack={() => { setMode('list'); fetchBriefs(); }} onEdit={() => setMode('form')} />;
  if (mode === 'client-view' && activeBrief) return <ClientBriefView brief={activeBrief} api={api} user={user} onBack={() => { setMode('list'); fetchBriefs(); }} />;

  return (
    <div className="flex flex-col h-full" data-testid="brief-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-black" data-testid="brief-title">Brief</h1>
            <p className="text-xs text-gray-400 mt-1">{briefs.length} brief{briefs.length !== 1 ? 's' : ''} created</p>
          </div>
          {user?.role !== 'Client' && (
            <Button onClick={() => setShowNewDialog(true)} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" size="sm" data-testid="new-brief-btn">
              <Plus className="w-4 h-4 mr-1" /> New Brief
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {briefs.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No briefs yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {briefs.map((b, i) => {
                const st = STATUS_MAP[b.status] || STATUS_MAP.draft;
                return (
                  <Card key={b.id} className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group" onClick={() => openBrief(b)} data-testid={`brief-card-${i}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-black">{b.project_name || 'Untitled'}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{b.client_name || 'No client'}</p>
                      </div>
                      <Badge className={`${st.color} text-[10px] border-0`}>{st.label}</Badge>
                    </div>
                    <div className="text-[10px] text-gray-400 space-y-1">
                      <p>Created by {b.created_by}</p>
                      <p>{new Date(b.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">{b.comments?.length || 0} comments</span>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }} className="text-gray-300 hover:text-[#e31d3b] transition-colors" data-testid={`delete-brief-${i}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-sm" data-testid="new-brief-dialog">
          <DialogHeader><DialogTitle>New Brief</DialogTitle></DialogHeader>
          <div className="py-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Name *</Label>
            <Input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="mt-1" placeholder="e.g. Sunrise Villa" data-testid="new-brief-name" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="new-brief-submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function BriefForm({ brief, api, user, onBack, onGenerated }) {
  const [form, setForm] = useState({ ...brief });
  const [openSections, setOpenSections] = useState({ client: true });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const autoSaveTimer = useRef(null);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => handleSave({ ...form, [key]: value }), 2000);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const d = data || form;
      await api.put(`/briefs/${brief.id}`, d);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.put(`/briefs/${brief.id}`, form);
      const res = await api.post(`/briefs/${brief.id}/generate`);
      const updated = await api.get(`/briefs/${brief.id}`);
      toast.success('Document generated');
      onGenerated(updated.data);
    } catch (err) { toast.error('Failed to generate document'); }
    finally { setGenerating(false); }
  };

  const handleSendToClient = async () => {
    try {
      await api.put(`/briefs/${brief.id}`, form);
      await api.post(`/briefs/${brief.id}/generate`);
      await api.post(`/briefs/${brief.id}/send`);
      toast.success('Brief sent to client');
    } catch (err) { toast.error('Failed to send'); }
  };

  const toggleSection = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const getSectionProgress = (section) => {
    const filled = section.fields.filter(f => form[f] && String(form[f]).trim()).length;
    return Math.round((filled / section.fields.length) * 100);
  };

  const totalProgress = Math.round(
    SECTIONS.reduce((acc, s) => acc + s.fields.filter(f => form[f] && String(form[f]).trim()).length, 0) /
    SECTIONS.reduce((acc, s) => acc + s.fields.length, 0) * 100
  );

  return (
    <div className="flex flex-col h-full" data-testid="brief-form">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black transition-colors" data-testid="brief-back-btn"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-base font-bold text-black">{form.project_name || 'Untitled Brief'}</h1>
              <p className="text-[11px] text-gray-400">Module: Brief</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{saving ? 'Saving...' : 'Auto-saved'}</span>
            <Button variant="outline" size="sm" onClick={() => handleSave()} data-testid="brief-save-btn">
              <Save className="w-3.5 h-3.5 mr-1" /> Save Draft
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} data-testid="brief-generate-btn">
              {generating ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <FileText className="w-3.5 h-3.5 mr-1" />} Generate Document
            </Button>
            <Button size="sm" onClick={handleSendToClient} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="brief-send-btn">
              <Send className="w-3.5 h-3.5 mr-1" /> Send to Client
            </Button>
          </div>
        </div>
        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <Progress value={totalProgress} className="h-1.5 flex-1 bg-gray-100 progress-orange" />
          <span className="text-xs font-bold text-gray-500">{totalProgress}%</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            const isOpen = openSections[section.id];
            const prog = getSectionProgress(section);
            return (
              <Card key={section.id} className="overflow-hidden transition-all" data-testid={`section-${section.id}`}>
                <button onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prog === 100 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#ef7f1b]'}`}>
                      {prog === 100 ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black">{section.title}</h3>
                      <p className="text-[10px] text-gray-400">{prog}% complete</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100 animate-fadeInUp">
                    <SectionFields section={section.id} form={form} onChange={updateField} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}


function SectionFields({ section, form, onChange }) {
  const field = (key, label, type = 'input', opts = {}) => (
    <div key={key} className={opts.full ? 'col-span-2' : ''}>
      <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</Label>
      {type === 'input' && <Input value={form[key] || ''} onChange={e => onChange(key, e.target.value)} className="mt-1" placeholder={opts.placeholder} />}
      {type === 'textarea' && <Textarea value={form[key] || ''} onChange={e => onChange(key, e.target.value)} className="mt-1" rows={opts.rows || 2} placeholder={opts.placeholder} />}
      {type === 'select' && (
        <Select value={form[key] || ''} onValueChange={v => onChange(key, v)}>
          <SelectTrigger className="mt-1"><SelectValue placeholder={opts.placeholder || 'Select...'} /></SelectTrigger>
          <SelectContent>{(opts.options || []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      )}
    </div>
  );

  const sections = {
    client: (
      <div className="grid grid-cols-2 gap-4">
        {field('client_name', 'Client Name', 'input', { placeholder: 'Full name' })}
        {field('client_phone', 'Phone Number', 'input', { placeholder: '+91 ...' })}
        {field('client_email', 'Email', 'input', { placeholder: 'email@example.com' })}
        {field('client_location', 'Location', 'input', { placeholder: 'City, State' })}
        {field('comm_preference', 'Communication Preference', 'select', { options: ['Email', 'WhatsApp', 'Phone', 'Video Call'], full: true })}
      </div>
    ),
    project: (
      <div className="grid grid-cols-2 gap-4">
        {field('project_type', 'Project Type', 'select', { options: ['Residential', 'Commercial', 'Interior', 'Renovation'] })}
        {field('project_address', 'Project Address', 'input', { placeholder: 'Full address' })}
        {field('project_area', 'Project Area', 'input', { placeholder: 'e.g. 2500 sq.ft' })}
        {field('timeline_expectations', 'Timeline Expectations', 'textarea', { placeholder: 'Expected timeline for project completion', rows: 2 })}
      </div>
    ),
    lifestyle: (
      <div className="grid grid-cols-2 gap-4">
        {field('family_members', 'Family Members', 'input', { placeholder: 'e.g. 4 members, 2 kids' })}
        {field('usage_requirements', 'Usage Requirements', 'textarea', { placeholder: 'Home office, guest rooms, etc.', rows: 2 })}
        {field('special_needs', 'Special Needs', 'textarea', { placeholder: 'Elderly-friendly, pet-friendly, etc.', rows: 2 })}
        {field('future_expansion', 'Future Expansion Plans', 'textarea', { placeholder: 'Plans for future additions', rows: 2 })}
      </div>
    ),
    design: (
      <div className="grid grid-cols-2 gap-4">
        {field('design_style', 'Design Style Preference', 'select', { options: ['Modern', 'Minimal', 'Traditional', 'Luxury', 'Contemporary'] })}
        {field('material_preferences', 'Material Preferences', 'textarea', { placeholder: 'Italian marble, teak wood, etc.', rows: 2 })}
        {field('lighting_preference', 'Lighting Preference', 'textarea', { placeholder: 'Natural light, warm tones, etc.', rows: 2 })}
        {field('color_preferences', 'Color Preferences', 'textarea', { placeholder: 'Neutral tones, earth colors, etc.', rows: 2 })}
      </div>
    ),
    budget: (
      <div className="grid grid-cols-2 gap-4">
        {field('budget_range', 'Budget Range', 'input', { placeholder: 'e.g. 50-80 Lakhs' })}
        {field('budget_flexibility', 'Budget Flexibility', 'select', { options: ['Fixed', 'Slightly Flexible', 'Flexible', 'No Limit'] })}
        {field('priority_areas', 'Priority Areas for Investment', 'textarea', { placeholder: 'Kitchen, master bedroom, landscaping...', rows: 2, full: true })}
        {field('cost_optimization_areas', 'Cost Optimization Areas', 'textarea', { placeholder: 'Areas where client wants to save costs', rows: 2, full: true })}
      </div>
    ),
    references: (
      <div className="grid grid-cols-2 gap-4">
        {field('reference_links', 'Reference Links', 'textarea', { placeholder: 'Pinterest, Houzz, or any URL links', rows: 2, full: true })}
        {field('client_likes', 'Client Likes', 'textarea', { placeholder: 'Design elements the client appreciates', rows: 2 })}
        {field('client_dislikes', 'Client Dislikes', 'textarea', { placeholder: 'Design elements to avoid', rows: 2 })}
      </div>
    ),
  };

  return sections[section] || null;
}


function BriefDocument({ brief, api, user, onBack, onEdit }) {
  const [data, setData] = useState(brief);
  const [sending, setSending] = useState(false);

  const handleDownload = () => {
    if (data.document_url) {
      window.open(`${BACKEND}${data.document_url}`, '_blank');
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await api.post(`/briefs/${data.id}/send`);
      setData(prev => ({ ...prev, status: 'sent_to_client' }));
      toast.success('Brief sent to client');
    } catch (err) { toast.error('Failed to send'); }
    finally { setSending(false); }
  };

  const st = STATUS_MAP[data.status] || STATUS_MAP.draft;

  const docSections = [
    { title: 'Client Information', fields: [
      ['Client Name', data.client_name], ['Phone', data.client_phone], ['Email', data.client_email],
      ['Location', data.client_location], ['Communication', data.comm_preference]
    ]},
    { title: 'Project Overview', fields: [
      ['Project Type', data.project_type], ['Address', data.project_address],
      ['Area', data.project_area], ['Timeline', data.timeline_expectations]
    ]},
    { title: 'Client Lifestyle & Needs', fields: [
      ['Family Members', data.family_members], ['Usage Requirements', data.usage_requirements],
      ['Special Needs', data.special_needs], ['Future Expansion', data.future_expansion]
    ]},
    { title: 'Design Preferences', fields: [
      ['Style', data.design_style], ['Materials', data.material_preferences],
      ['Lighting', data.lighting_preference], ['Colors', data.color_preferences]
    ]},
    { title: 'Budget Understanding', fields: [
      ['Range', data.budget_range], ['Flexibility', data.budget_flexibility],
      ['Priority Areas', data.priority_areas], ['Optimization Areas', data.cost_optimization_areas]
    ]},
    { title: 'References & Inspirations', fields: [
      ['Reference Links', data.reference_links], ['Likes', data.client_likes], ['Dislikes', data.client_dislikes]
    ]},
  ];

  return (
    <div className="flex flex-col h-full" data-testid="brief-document">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-base font-bold text-black">{data.project_name}</h1>
              <p className="text-[11px] text-gray-400">Brief Document</p>
            </div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>{st.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} data-testid="brief-edit-btn"><Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Form</Button>
            <Button variant="outline" size="sm" onClick={handleDownload} data-testid="brief-download-btn"><Download className="w-3.5 h-3.5 mr-1" /> Download PDF</Button>
            <Button size="sm" onClick={handleSend} disabled={sending} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="brief-share-btn">
              {sending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />} Share with Client
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          {/* PDF-style document viewer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Doc Header */}
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">Project Brief Document</h2>
              <p className="text-sm text-gray-500 mt-1">{data.project_name} &middot; {new Date(data.created_at).toLocaleDateString()}</p>
            </div>

            {/* Doc Sections */}
            <div className="p-8 space-y-8">
              {docSections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">{i + 1}. {sec.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sec.fields.map(([label, value], j) => (
                      <div key={j} className={!value ? 'opacity-40' : ''}>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
                        <p className="text-sm text-black mt-0.5">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Doc Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">Generated by BUILDCON &middot; Confidential Document</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}


function ClientBriefView({ brief, api, user, onBack }) {
  const [data, setData] = useState(brief);
  const [comment, setComment] = useState('');
  const [changeNote, setChangeNote] = useState('');
  const [showChangesDialog, setShowChangesDialog] = useState(false);

  const handleApprove = async () => {
    try {
      await api.post(`/briefs/${data.id}/approve`);
      setData(prev => ({ ...prev, status: 'approved' }));
      toast.success('Brief approved');
    } catch (err) { toast.error('Failed to approve'); }
  };

  const handleRequestChanges = async () => {
    try {
      await api.post(`/briefs/${data.id}/request-changes`, { note: changeNote });
      setData(prev => ({ ...prev, status: 'changes_requested' }));
      setShowChangesDialog(false);
      setChangeNote('');
      toast.success('Change request submitted');
    } catch (err) { toast.error('Failed to request changes'); }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/briefs/${data.id}/comments`, { content: comment });
      setData(prev => ({ ...prev, comments: res.data.comments }));
      setComment('');
      toast.success('Comment added');
    } catch (err) { toast.error('Failed to add comment'); }
  };

  const handleDownload = () => {
    if (data.document_url) window.open(`${BACKEND}${data.document_url}`, '_blank');
  };

  const st = STATUS_MAP[data.status] || STATUS_MAP.draft;

  const viewSections = [
    { title: 'Project Overview', fields: [['Type', data.project_type], ['Area', data.project_area], ['Address', data.project_address], ['Timeline', data.timeline_expectations]] },
    { title: 'Requirements', fields: [['Family', data.family_members], ['Usage', data.usage_requirements], ['Special Needs', data.special_needs], ['Expansion', data.future_expansion]] },
    { title: 'Preferences', fields: [['Style', data.design_style], ['Materials', data.material_preferences], ['Lighting', data.lighting_preference], ['Colors', data.color_preferences]] },
    { title: 'Budget Understanding', fields: [['Range', data.budget_range], ['Flexibility', data.budget_flexibility], ['Priorities', data.priority_areas], ['Optimization', data.cost_optimization_areas]] },
    { title: 'References', fields: [['Links', data.reference_links], ['Likes', data.client_likes], ['Dislikes', data.client_dislikes]] },
  ];

  return (
    <div className="flex flex-col h-full" data-testid="brief-client-view">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-base font-bold text-black">{data.project_name}</h1>
              <p className="text-[11px] text-gray-400">Brief Document</p>
            </div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>{st.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {data.document_url && <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-3.5 h-3.5 mr-1" /> Download</Button>}
            {data.status !== 'approved' && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowChangesDialog(true)} className="text-[#e31d3b] border-red-200" data-testid="brief-request-changes-btn">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" /> Request Changes
                </Button>
                <Button size="sm" onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white" data-testid="brief-approve-btn">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve Brief
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>
              <h2 className="text-2xl font-bold text-black mt-4">Project Brief</h2>
              <p className="text-sm text-gray-500 mt-1">{data.project_name}</p>
            </div>
            <div className="p-8 space-y-8">
              {viewSections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">{sec.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sec.fields.map(([label, value], j) => value ? (
                      <div key={j}><p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p><p className="text-sm text-black mt-0.5">{value}</p></div>
                    ) : null)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-black mb-4">Comments</h3>
            <div className="space-y-3 mb-4">
              {(data.comments || []).map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0">{c.sender?.[0]}</div>
                  <div>
                    <p className="text-xs font-medium text-black">{c.sender} <span className="text-gray-400 font-normal">{new Date(c.timestamp).toLocaleString()}</span></p>
                    <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
              {(!data.comments || data.comments.length === 0) && <p className="text-xs text-gray-400">No comments yet</p>}
            </div>
            <div className="flex gap-2">
              <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1" data-testid="brief-comment-input" />
              <Button onClick={handleComment} size="sm" className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="brief-comment-submit">Send</Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Request Changes</DialogTitle></DialogHeader>
          <Textarea value={changeNote} onChange={e => setChangeNote(e.target.value)} placeholder="Describe what changes you'd like..." rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangesDialog(false)}>Cancel</Button>
            <Button onClick={handleRequestChanges} className="bg-[#e31d3b] hover:bg-[#c41830] text-white">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
