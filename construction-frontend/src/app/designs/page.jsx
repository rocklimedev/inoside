import React, { useState, useEffect, useRef } from 'react';
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
import { toast } from 'sonner';
import {
  Plus, Upload, Download, Eye, ArrowLeft, Search, Grid3X3, List,
  Check, X, FileText, Loader2, MessageCircle, History, Lock,
  CheckCircle, AlertCircle, Clock, RefreshCw, Trash2, Filter
} from 'lucide-react';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const CATEGORIES = [
  'All', 'Interior', 'Room-wise', 'Structure', 'MEP', 'Walls', 'Doors', 'Windows',
  'Lighting', 'Furniture', 'Ceiling', 'Flooring', 'Elevations', '2D Layouts', '3D Views', 'Other'
];

const STATUS_BADGE = {
  pending: { label: 'Pending Review', color: 'bg-yellow-50 text-yellow-700' },
  pending_review: { label: 'Pending Review', color: 'bg-yellow-50 text-yellow-700' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-700' },
  changes_requested: { label: 'Changes Requested', color: 'bg-red-50 text-[#e31d3b]' },
};

export default function DesignPage() {
  const { api, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [activeDesign, setActiveDesign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProject) fetchDesigns();
  }, [selectedProject]);

  const fetchDesigns = async () => {
    try { const r = await api.get(`/designs?project_id=${selectedProject.id}`); setDesigns(r.data); }
    catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/designs/${id}`); setDesigns(p => p.filter(d => d.id !== id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const filtered = designs.filter(d => {
    if (activeCategory !== 'All' && d.category !== activeCategory) return false;
    if (filterStatus !== 'all' && d.approval_status !== filterStatus) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  if (activeDesign) return <DesignDetail design={activeDesign} api={api} user={user} onBack={() => { setActiveDesign(null); fetchDesigns(); }} />;

  // Project selector if no project selected
  if (!selectedProject) {
    return (
      <div className="flex flex-col h-full" data-testid="design-page">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-black text-black" data-testid="design-title">Design</h1>
          <p className="text-xs text-gray-400 mt-1">Select a project to manage designs</p>
        </div>
        <div className="p-4 md:p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="pl-10" data-testid="design-project-search" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
              <Card key={p.id} className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer" onClick={() => setSelectedProject(p)} data-testid={`design-project-${i}`}>
                <h3 className="text-sm font-bold text-black">{p.name}</h3>
                <p className="text-[10px] text-gray-400 mt-1">{p.client} &middot; {p.stage}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="design-library">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-base font-bold text-black">{selectedProject.name}</h1>
              <p className="text-[11px] text-gray-400">Design Library &middot; {designs.length} drawings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 text-xs w-36"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="changes_requested">Changes Requested</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}><List className="w-4 h-4" /></button>
            </div>
            {user?.role !== 'Client' && (
              <Button onClick={() => setShowUpload(true)} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" size="sm" data-testid="upload-design-btn">
                <Upload className="w-4 h-4 mr-1" /> Upload Drawing
              </Button>
            )}
          </div>
        </div>
        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-[#ef7f1b] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Designs grid/list */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16"><FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No drawings in this category</p></div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((d, i) => {
                const st = STATUS_BADGE[d.approval_status] || STATUS_BADGE.pending;
                return (
                  <Card key={d.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveDesign(d)} data-testid={`design-card-${i}`}>
                    <div className="h-36 bg-gray-100 flex items-center justify-center relative">
                      {d.preview_url ? <img src={`${BACKEND}${d.preview_url}`} alt="" className="w-full h-full object-cover" /> : <FileText className="w-10 h-10 text-gray-300" />}
                      {d.locked && <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><Lock className="w-3 h-3 text-white" /></div>}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-xs font-bold text-black truncate">{d.title}</h3>
                        <Badge className={`${st.color} text-[9px] border-0 shrink-0 ml-1`}>{st.label}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{d.category}</span>
                        <span>{d.version}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                        <span>{d.uploaded_by}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{(d.comments || []).length}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((d, i) => {
                const st = STATUS_BADGE[d.approval_status] || STATUS_BADGE.pending;
                return (
                  <Card key={d.id} className="p-3 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveDesign(d)} data-testid={`design-row-${i}`}>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      {d.preview_url ? <img src={`${BACKEND}${d.preview_url}`} alt="" className="w-full h-full object-cover rounded-lg" /> : <FileText className="w-5 h-5 text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-black truncate">{d.title}</h3>
                      <p className="text-[10px] text-gray-400">{d.category} &middot; {d.version} &middot; by {d.uploaded_by}</p>
                    </div>
                    <Badge className={`${st.color} text-[9px] border-0`}>{st.label}</Badge>
                    {d.locked && <Lock className="w-3.5 h-3.5 text-green-500" />}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Upload dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md" data-testid="upload-design-dialog">
          <DialogHeader><DialogTitle>Upload Drawing</DialogTitle></DialogHeader>
          <UploadDesignForm api={api} projectId={selectedProject.id} projectName={selectedProject.name}
            onSuccess={(d) => { setDesigns(p => [...p, d]); setShowUpload(false); toast.success('Drawing uploaded'); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UploadDesignForm({ api, projectId, projectName, onSuccess }) {
  const [form, setForm] = useState({ title: '', category: '2D Layouts', description: '', room_area_tag: '', version: 'v1.0' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Title required'); return; }
    if (!file) { toast.error('Select a PDF file'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const upRes = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const res = await api.post('/designs', {
        ...form, project_id: projectId, project_name: projectName,
        file_url: upRes.data.url, file_id: upRes.data.file_id, filename: file.name
      });
      onSuccess(res.data);
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-3 py-2">
      <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</Label>
        <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Title *</Label>
        <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" placeholder="e.g. Master Bedroom Floor Plan" data-testid="design-title-input" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Version</Label>
          <Input value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} className="mt-1" /></div>
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Room / Area Tag</Label>
          <Input value={form.room_area_tag} onChange={e => setForm(p => ({ ...p, room_area_tag: e.target.value }))} className="mt-1" placeholder="e.g. Master Bedroom" /></div>
      </div>
      <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Description</Label>
        <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" rows={2} /></div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PDF File *</Label>
        <div onClick={() => fileRef.current?.click()} className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#ef7f1b]/50 transition-colors">
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
          {file ? <p className="text-sm font-medium text-black">{file.name}</p> : <p className="text-xs text-gray-400">Click to select PDF</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={uploading} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="design-upload-submit">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />} Upload
        </Button>
      </div>
    </div>
  );
}

function DesignDetail({ design, api, user, onBack }) {
  const [data, setData] = useState(design);
  const [comment, setComment] = useState('');
  const [showRevisions, setShowRevisions] = useState(false);
  const [showApprovalLog, setShowApprovalLog] = useState(false);
  const [remarks, setRemarks] = useState('');
  const replaceRef = useRef(null);

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const r = await api.post(`/designs/${data.id}/comments`, { content: comment });
      setData(p => ({ ...p, comments: r.data.comments }));
      setComment(''); toast.success('Comment added');
    } catch { toast.error('Failed'); }
  };

  const handleApprove = async (status) => {
    try {
      const r = await api.post(`/designs/${data.id}/approve`, { status, remarks });
      setData(r.data); setRemarks('');
      toast.success(status === 'approved' ? 'Design approved' : 'Changes requested');
    } catch { toast.error('Failed'); }
  };

  const handleRevise = async (file) => {
    try {
      const fd = new FormData(); fd.append('file', file);
      const upRes = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const r = await api.post(`/designs/${data.id}/revise`, { file_url: upRes.data.url, file_id: upRes.data.file_id, filename: file.name });
      setData(r.data); toast.success('Revised version uploaded');
    } catch { toast.error('Failed'); }
  };

  const handleDownload = () => { if (data.file_url) window.open(`${BACKEND}${data.file_url}`, '_blank'); };
  const st = STATUS_BADGE[data.approval_status] || STATUS_BADGE.pending;
  const isPdf = data.filename?.toLowerCase().endsWith('.pdf');

  return (
    <div className="flex flex-col h-full" data-testid="design-detail">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-base font-bold text-black">{data.title}</h1>
              <p className="text-[11px] text-gray-400">{data.category} &middot; {data.version}</p>
            </div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>{st.label}</Badge>
            {data.locked && <Badge className="bg-green-50 text-green-700 text-[10px] border-0"><Lock className="w-3 h-3 mr-1" /> Locked</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowRevisions(true)}><History className="w-3.5 h-3.5 mr-1" /> Revisions</Button>
            <Button variant="outline" size="sm" onClick={() => setShowApprovalLog(true)}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Approvals</Button>
            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-3.5 h-3.5 mr-1" /> Download</Button>
            {user?.role !== 'Client' && !data.locked && (
              <>
                <input ref={replaceRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleRevise(e.target.files[0])} />
                <Button variant="outline" size="sm" onClick={() => replaceRef.current?.click()}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Revise</Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
          {isPdf && data.file_url ? (
            <iframe src={`${BACKEND}${data.file_url}`} className="w-full h-full rounded-lg border border-gray-200 bg-white" title="Design Preview" />
          ) : (
            <div className="text-center"><FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-500">{data.filename || 'No file'}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleDownload}><Download className="w-3.5 h-3.5 mr-1" /> Download</Button></div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
          {/* Approval actions */}
          {data.approval_status !== 'approved' && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xs font-bold text-black mb-2">Review</h3>
              <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add remarks..." rows={2} className="mb-2 text-xs" />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove('approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs" data-testid="design-approve-btn"><Check className="w-3 h-3 mr-1" /> Approve</Button>
                <Button size="sm" variant="outline" onClick={() => handleApprove('changes_requested')} className="flex-1 text-[#e31d3b] border-red-200 text-xs" data-testid="design-changes-btn"><X className="w-3 h-3 mr-1" /> Changes</Button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-4 border-b border-gray-200 text-sm space-y-2">
            <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Uploaded By</p><p className="text-black text-xs">{data.uploaded_by}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Date</p><p className="text-black text-xs">{new Date(data.created_at).toLocaleDateString()}</p></div>
            {data.room_area_tag && <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Area</p><p className="text-black text-xs">{data.room_area_tag}</p></div>}
            {data.description && <div><p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Description</p><p className="text-black text-xs">{data.description}</p></div>}
          </div>

          {/* Comments */}
          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-xs font-bold text-black mb-2">Comments</h3>
            <ScrollArea className="flex-1 mb-3"><div className="space-y-3">
              {(data.comments || []).map((c, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[9px] font-bold shrink-0">{c.sender?.[0]}</div>
                  <div><p className="text-[10px] font-medium text-black">{c.sender} <span className="text-gray-400">{c.role}</span></p>
                    <p className="text-xs text-gray-600">{c.content}</p></div>
                </div>
              ))}
              {(!data.comments || data.comments.length === 0) && <p className="text-xs text-gray-400">No comments</p>}
            </div></ScrollArea>
            <div className="flex gap-2 mt-auto">
              <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add comment..." className="flex-1 text-xs" data-testid="design-comment-input" />
              <Button onClick={handleComment} size="sm" className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white px-3"><MessageCircle className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>
      </div>

      {/* Revision History Dialog */}
      <Dialog open={showRevisions} onOpenChange={setShowRevisions}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Revision History</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(data.revision_history || []).length === 0 ? <p className="text-xs text-gray-400">No revisions yet</p> :
              (data.revision_history || []).map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <History className="w-4 h-4 text-gray-400" />
                  <div><p className="text-xs font-medium">{r.version}</p><p className="text-[10px] text-gray-400">by {r.revised_by} &middot; {new Date(r.timestamp).toLocaleString()}</p></div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Log Dialog */}
      <Dialog open={showApprovalLog} onOpenChange={setShowApprovalLog}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Approval Log</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(data.approval_log || []).length === 0 ? <p className="text-xs text-gray-400">No approvals yet</p> :
              (data.approval_log || []).map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                  {a.action === 'approved' ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-[#e31d3b] mt-0.5" />}
                  <div><p className="text-xs font-medium capitalize">{a.action}</p>
                    <p className="text-[10px] text-gray-400">by {a.by} ({a.role}) &middot; {new Date(a.timestamp).toLocaleString()}</p>
                    {a.remarks && <p className="text-xs text-gray-600 mt-1">{a.remarks}</p>}</div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
