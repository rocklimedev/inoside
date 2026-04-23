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
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Plus, FileText, Send, Save, Download, ChevronDown, ChevronRight, Check,
  MapPin, Ruler, Building2, Zap, Eye as EyeIcon, Camera, ArrowLeft, Loader2,
  Edit3, Trash2, Upload, X, Image, CheckCircle, AlertCircle
} from 'lucide-react';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const SECTIONS = [
  { id: 'details', title: 'Site Details', icon: MapPin, fields: ['site_address', 'location_coordinates', 'site_access_conditions'] },
  { id: 'measurements', title: 'Site Measurements', icon: Ruler, fields: ['plot_size', 'height_restrictions', 'setback_rules'] },
  { id: 'context', title: 'Surrounding Context', icon: Building2, fields: ['neighboring_buildings', 'road_width', 'sun_orientation', 'noise_levels'] },
  { id: 'utilities', title: 'Utilities', icon: Zap, fields: ['water_connection', 'electricity', 'drainage', 'internet_connectivity'] },
  { id: 'observations', title: 'Site Observations', icon: EyeIcon, fields: ['soil_condition', 'structural_limitations', 'risk_factors'] },
  { id: 'photos', title: 'Site Photos', icon: Camera, fields: [] },
];

const STATUS_MAP = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  completed: { label: 'Report Ready', color: 'bg-blue-50 text-blue-600' },
  sent_to_client: { label: 'Sent', color: 'bg-orange-50 text-[#ef7f1b]' },
  approved: { label: 'Approved', color: 'bg-green-50 text-green-600' },
  changes_requested: { label: 'Changes Requested', color: 'bg-red-50 text-[#e31d3b]' },
};

export default function SiteRekiPage() {
  const { api, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [mode, setMode] = useState('list');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    try { const res = await api.get('/site-rekis'); setItems(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error('Project name required'); return; }
    try {
      const res = await api.post('/site-rekis', { project_name: newName });
      setItems(prev => [...prev, res.data]);
      setActive(res.data);
      setMode('form');
      setShowNewDialog(false);
      setNewName('');
      toast.success('Site Reki created');
    } catch (err) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/site-rekis/${id}`);
      setItems(prev => prev.filter(x => x.id !== id));
      if (active?.id === id) { setActive(null); setMode('list'); }
      toast.success('Deleted');
    } catch (err) { toast.error('Failed'); }
  };

  const openItem = (item) => {
    setActive(item);
    setMode(user?.role === 'Client' ? 'client-view' : (item.document_generated ? 'document' : 'form'));
  };

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  if (mode === 'form' && active) return <SiteRekiForm item={active} api={api} user={user} onBack={() => { setMode('list'); fetchItems(); }} onGenerated={(d) => { setActive(d); setMode('document'); }} />;
  if (mode === 'document' && active) return <SiteRekiDocument item={active} api={api} user={user} onBack={() => { setMode('list'); fetchItems(); }} onEdit={() => setMode('form')} />;
  if (mode === 'client-view' && active) return <SiteRekiClientView item={active} api={api} user={user} onBack={() => { setMode('list'); fetchItems(); }} />;

  return (
    <div className="flex flex-col h-full" data-testid="sitereki-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-black text-black" data-testid="sitereki-title">Site Reki</h1>
            <p className="text-xs text-gray-400 mt-1">{items.length} report{items.length !== 1 ? 's' : ''}</p></div>
          {user?.role !== 'Client' && (
            <Button onClick={() => setShowNewDialog(true)} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" size="sm" data-testid="new-sitereki-btn">
              <Plus className="w-4 h-4 mr-1" /> New Site Reki
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {items.length === 0 ? (
            <div className="text-center py-20"><MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No site reki reports yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => {
                const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
                return (
                  <Card key={item.id} className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer" onClick={() => openItem(item)} data-testid={`sitereki-card-${i}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-bold text-black">{item.project_name}</h3>
                      <Badge className={`${st.color} text-[10px] border-0`}>{st.label}</Badge>
                    </div>
                    <div className="text-[10px] text-gray-400 space-y-1">
                      {item.site_address && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.site_address}</p>}
                      <p>By {item.created_by} &middot; {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">{(item.site_photos || []).length} photos</span>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-gray-300 hover:text-[#e31d3b]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>New Site Reki</DialogTitle></DialogHeader>
          <div className="py-2"><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Name *</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} className="mt-1" data-testid="new-sitereki-name" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="new-sitereki-submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function SiteRekiForm({ item, api, user, onBack, onGenerated }) {
  const [form, setForm] = useState({ ...item });
  const [openSections, setOpenSections] = useState({ details: true });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoRef = useRef(null);
  const autoSaveTimer = useRef(null);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => handleSave({ ...form, [key]: value }), 2000);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try { await api.put(`/site-rekis/${item.id}`, data || form); } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.put(`/site-rekis/${item.id}`, form);
      await api.post(`/site-rekis/${item.id}/generate`);
      const updated = await api.get(`/site-rekis/${item.id}`);
      toast.success('Report generated');
      onGenerated(updated.data);
    } catch (err) { toast.error('Failed'); }
    finally { setGenerating(false); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const photos = [...(form.site_photos || []), { url: res.data.url, name: file.name }];
      setForm(prev => ({ ...prev, site_photos: photos }));
      await api.put(`/site-rekis/${item.id}`, { site_photos: photos });
      toast.success('Photo uploaded');
    } catch (err) { toast.error('Upload failed'); }
    finally { setUploadingPhoto(false); }
  };

  const removePhoto = (idx) => {
    const photos = (form.site_photos || []).filter((_, i) => i !== idx);
    setForm(prev => ({ ...prev, site_photos: photos }));
  };

  const toggleSection = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  const allFields = SECTIONS.flatMap(s => s.fields);
  const filledCount = allFields.filter(f => form[f] && String(form[f]).trim()).length + ((form.site_photos || []).length > 0 ? 1 : 0);
  const totalProgress = Math.round((filledCount / (allFields.length + 1)) * 100);

  const field = (key, label, type = 'input', opts = {}) => (
    <div key={key} className={opts.full ? 'col-span-2' : ''}>
      <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</Label>
      {type === 'input' && <Input value={form[key] || ''} onChange={e => updateField(key, e.target.value)} className="mt-1" placeholder={opts.placeholder} />}
      {type === 'textarea' && <Textarea value={form[key] || ''} onChange={e => updateField(key, e.target.value)} className="mt-1" rows={2} placeholder={opts.placeholder} />}
      {type === 'select' && (
        <Select value={form[key] || ''} onValueChange={v => updateField(key, v)}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
          <SelectContent>{(opts.options || []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      )}
    </div>
  );

  const sectionFields = {
    details: <div className="grid grid-cols-2 gap-4">
      {field('site_address', 'Site Address', 'input', { placeholder: 'Full address' })}
      {field('location_coordinates', 'Location Coordinates', 'input', { placeholder: 'Lat, Long' })}
      {field('site_access_conditions', 'Site Access Conditions', 'textarea', { placeholder: 'Road access, restrictions...', full: true })}
    </div>,
    measurements: <div className="grid grid-cols-2 gap-4">
      {field('plot_size', 'Plot Size', 'input', { placeholder: 'e.g. 2400 sq.ft' })}
      {field('height_restrictions', 'Building Height Restrictions', 'input', { placeholder: 'e.g. G+3 floors' })}
      {field('setback_rules', 'Setback Rules', 'textarea', { placeholder: 'Front, side, rear setbacks', full: true })}
    </div>,
    context: <div className="grid grid-cols-2 gap-4">
      {field('neighboring_buildings', 'Neighboring Buildings', 'textarea', { placeholder: 'Describe surroundings' })}
      {field('road_width', 'Road Width', 'input', { placeholder: 'e.g. 30 ft' })}
      {field('sun_orientation', 'Sun Orientation', 'select', { options: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] })}
      {field('noise_levels', 'Noise Levels', 'select', { options: ['Low', 'Moderate', 'High', 'Very High'] })}
    </div>,
    utilities: <div className="grid grid-cols-2 gap-4">
      {field('water_connection', 'Water Connection', 'select', { options: ['Available', 'Partially Available', 'Not Available', 'Borewell'] })}
      {field('electricity', 'Electricity', 'select', { options: ['Available', 'Partially Available', 'Not Available'] })}
      {field('drainage', 'Drainage', 'select', { options: ['Municipal', 'Septic Tank', 'Not Available'] })}
      {field('internet_connectivity', 'Internet Connectivity', 'select', { options: ['Fiber', 'Broadband', 'Limited', 'Not Available'] })}
    </div>,
    observations: <div className="grid grid-cols-2 gap-4">
      {field('soil_condition', 'Soil Condition', 'textarea', { placeholder: 'Clay, rocky, sandy...' })}
      {field('structural_limitations', 'Structural Limitations', 'textarea', { placeholder: 'Any known limitations' })}
      {field('risk_factors', 'Risk Factors', 'textarea', { placeholder: 'Flooding, seismic, etc.', full: true })}
    </div>,
    photos: (
      <div>
        <div className="flex flex-wrap gap-3 mb-3">
          {(form.site_photos || []).map((p, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={`${BACKEND}${p.url}`} alt={p.name} className="w-full h-full object-cover" />
              <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <Button variant="outline" size="sm" onClick={() => photoRef.current?.click()} disabled={uploadingPhoto}>
          {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Camera className="w-3.5 h-3.5 mr-1" />} Add Photo
        </Button>
      </div>
    ),
  };

  return (
    <div className="flex flex-col h-full" data-testid="sitereki-form">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-base font-bold text-black">{form.project_name}</h1><p className="text-[11px] text-gray-400">Module: Site Reki</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">{saving ? 'Saving...' : 'Auto-saved'}</span>
            <Button variant="outline" size="sm" onClick={() => handleSave()}><Save className="w-3.5 h-3.5 mr-1" /> Save</Button>
            <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <FileText className="w-3.5 h-3.5 mr-1" />} Generate Report
            </Button>
          </div>
        </div>
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
            const sectionFilled = section.fields.filter(f => form[f] && String(form[f]).trim()).length;
            const sectionTotal = section.fields.length || 1;
            const prog = section.id === 'photos' ? ((form.site_photos || []).length > 0 ? 100 : 0) : Math.round((sectionFilled / sectionTotal) * 100);
            return (
              <Card key={section.id} className="overflow-hidden">
                <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prog === 100 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#ef7f1b]'}`}>
                      {prog === 100 ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div><h3 className="text-sm font-bold text-black">{section.title}</h3><p className="text-[10px] text-gray-400">{prog}% complete</p></div>
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && <div className="px-4 pb-4 pt-1 border-t border-gray-100 animate-fadeInUp">{sectionFields[section.id]}</div>}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}


function SiteRekiDocument({ item, api, user, onBack, onEdit }) {
  const st = STATUS_MAP[item.status] || STATUS_MAP.draft;
  const handleDownload = () => { if (item.document_url) window.open(`${BACKEND}${item.document_url}`, '_blank'); };

  const docSections = [
    { title: 'Site Details', fields: [['Address', item.site_address], ['Coordinates', item.location_coordinates], ['Access', item.site_access_conditions]] },
    { title: 'Measurements', fields: [['Plot Size', item.plot_size], ['Height Restrictions', item.height_restrictions], ['Setback Rules', item.setback_rules]] },
    { title: 'Context', fields: [['Neighbors', item.neighboring_buildings], ['Road Width', item.road_width], ['Sun', item.sun_orientation], ['Noise', item.noise_levels]] },
    { title: 'Utilities', fields: [['Water', item.water_connection], ['Electricity', item.electricity], ['Drainage', item.drainage], ['Internet', item.internet_connectivity]] },
    { title: 'Observations', fields: [['Soil', item.soil_condition], ['Limitations', item.structural_limitations], ['Risks', item.risk_factors]] },
  ];

  return (
    <div className="flex flex-col h-full" data-testid="sitereki-document">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-base font-bold text-black">{item.project_name}</h1><p className="text-[11px] text-gray-400">Site Reki Report</p></div>
            <Badge className={`${st.color} text-[10px] border-0 ml-2`}>{st.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}><Edit3 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
            <Button variant="outline" size="sm" onClick={handleDownload}><Download className="w-3.5 h-3.5 mr-1" /> Download PDF</Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1"><span className="text-lg font-black text-black">BUILD</span><span className="text-lg font-black text-[#ef7f1b]">CON</span></div>
              <h2 className="text-2xl font-bold text-black mt-4">Site Reki Report</h2>
              <p className="text-sm text-gray-500 mt-1">{item.project_name} &middot; {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <div className="p-8 space-y-8">
              {docSections.map((sec, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">{i + 1}. {sec.title}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sec.fields.map(([label, value], j) => (
                      <div key={j} className={!value ? 'opacity-40' : ''}><p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p><p className="text-sm text-black mt-0.5">{value || '—'}</p></div>
                    ))}
                  </div>
                </div>
              ))}
              {(item.site_photos || []).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ef7f1b] mb-4">6. Site Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {item.site_photos.map((p, i) => (
                      <img key={i} src={`${BACKEND}${p.url}`} alt={p.name} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">Generated by BUILDCON &middot; Confidential Document</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}


function SiteRekiClientView({ item, api, user, onBack }) {
  const handleApprove = async () => {
    try { await api.post(`/site-rekis/${item.id}/approve`); toast.success('Approved'); } catch { toast.error('Failed'); }
  };
  const handleDownload = () => { if (item.document_url) window.open(`${BACKEND}${item.document_url}`, '_blank'); };

  return (
    <SiteRekiDocument item={item} api={api} user={user} onBack={onBack} onEdit={() => {}} />
  );
}
