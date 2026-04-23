import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Plus, Search, ArrowLeft, Loader2, Trash2, Package, TrendingUp,
  Truck, DollarSign, AlertTriangle, CheckCircle, Clock, X
} from 'lucide-react';

const CATEGORIES = ['Civil', 'Electrical', 'Plumbing', 'Furniture', 'Fixtures', 'Finishes', 'Other'];
const UNITS = ['sqft', 'sqm', 'nos', 'rft', 'kg', 'cum', 'bag', 'lot', 'set', 'ltr'];
const DELIVERY_STATUS = ['pending', 'dispatched', 'delivered', 'partial', 'damaged'];

const fmt = (n) => {
  const num = Number(n);
  if (!num && num !== 0) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
};

export default function InventoryPage() {
  const { api, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  if (selectedProject) return <InventoryWorkspace project={selectedProject} api={api} user={user} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="flex flex-col h-full" data-testid="inventory-page">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-black text-black" data-testid="inventory-title">Inventory</h1>
        <p className="text-xs text-gray-400 mt-1">Select a project to manage inventory</p>
      </div>
      <div className="p-4 md:p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="pl-10" data-testid="inv-project-search" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase())).map((p, i) => (
            <Card key={p.id} className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer" onClick={() => setSelectedProject(p)} data-testid={`inv-project-${i}`}>
              <h3 className="text-sm font-bold text-black">{p.name}</h3>
              <p className="text-[10px] text-gray-400 mt-1">{p.client} &middot; {p.stage}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryWorkspace({ project, api, user, onBack }) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dispatches, setDispatches] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('ledger');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [inv, sum, disp] = await Promise.all([
        api.get(`/inventory?project_id=${project.id}`),
        api.get(`/inventory/summary/${project.id}`),
        api.get(`/inventory/dispatches/${project.id}`),
      ]);
      setItems(inv.data); setSummary(sum.data); setDispatches(disp.data);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/inventory/${id}`); loadData(); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const kpi = summary || { total_items: 0, total_purchased_cost: 0, total_delivered: 0, total_used_cost: 0, remaining_stock_value: 0, pending_deliveries: 0 };

  return (
    <div className="flex flex-col h-full" data-testid="inventory-workspace">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black"><ArrowLeft className="w-5 h-5" /></button>
            <div><h1 className="text-base font-bold text-black">{project.name}</h1><p className="text-[11px] text-gray-400">Inventory Management</p></div>
          </div>
          {user?.role !== 'Client' && (
            <Button size="sm" onClick={() => setShowAdd(true)} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="add-material-btn">
              <Plus className="w-4 h-4 mr-1" /> Add Material
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
        {[
          { label: 'Materials', value: kpi.total_items, icon: Package },
          { label: 'Purchased', value: fmt(kpi.total_purchased_cost), icon: DollarSign },
          { label: 'Delivered', value: kpi.total_delivered, icon: Truck },
          { label: 'Used Cost', value: fmt(kpi.total_used_cost), icon: TrendingUp },
          { label: 'Remaining', value: fmt(kpi.remaining_stock_value), icon: Package },
          { label: 'Pending', value: kpi.pending_deliveries, icon: Clock },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card key={i} className="p-3 text-center" data-testid={`inv-kpi-${i}`}>
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-black text-black truncate">{k.value}</p>
              <p className="text-[9px] text-gray-400">{k.label}</p>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-3 bg-gray-100 p-0.5 rounded-lg w-fit">
          <TabsTrigger value="ledger" className="text-xs px-3 py-1.5">Material Ledger</TabsTrigger>
          <TabsTrigger value="dispatches" className="text-xs px-3 py-1.5">Dispatches</TabsTrigger>
          <TabsTrigger value="cost" className="text-xs px-3 py-1.5">Cost Summary</TabsTrigger>
        </TabsList>

        {/* Material Ledger */}
        <TabsContent value="ledger" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {items.length === 0 ? (
                <div className="text-center py-16"><Package className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No materials tracked yet</p></div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="inv-table">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                          <th className="py-2.5 px-3 text-left font-bold">Material</th>
                          <th className="py-2.5 px-3 text-left font-bold">Category</th>
                          <th className="py-2.5 px-3 text-left font-bold">Vendor</th>
                          <th className="py-2.5 px-3 text-right font-bold">Purchased</th>
                          <th className="py-2.5 px-3 text-right font-bold">To Site</th>
                          <th className="py-2.5 px-3 text-right font-bold">Used</th>
                          <th className="py-2.5 px-3 text-right font-bold">Remaining</th>
                          <th className="py-2.5 px-3 text-left font-bold">Unit</th>
                          <th className="py-2.5 px-3 text-right font-bold">Cost</th>
                          <th className="py-2.5 px-3 text-center font-bold">Status</th>
                          <th className="py-2.5 px-3 w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => {
                          const statusColors = { pending: 'bg-yellow-50 text-yellow-700', dispatched: 'bg-blue-50 text-blue-600', delivered: 'bg-green-50 text-green-700', partial: 'bg-orange-50 text-[#ef7f1b]', damaged: 'bg-red-50 text-[#e31d3b]' };
                          return (
                            <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/50" data-testid={`inv-row-${idx}`}>
                              <td className="py-2 px-3 font-medium text-xs text-black">{item.material_name}</td>
                              <td className="py-2 px-3 text-xs text-gray-600">{item.category}</td>
                              <td className="py-2 px-3 text-xs text-gray-600">{item.vendor_name || '—'}</td>
                              <td className="py-2 px-3 text-xs text-right">{item.quantity_purchased}</td>
                              <td className="py-2 px-3 text-xs text-right">{item.quantity_sent_to_site}</td>
                              <td className="py-2 px-3 text-xs text-right">{item.quantity_used}</td>
                              <td className="py-2 px-3 text-xs text-right font-medium">{item.quantity_remaining}</td>
                              <td className="py-2 px-3 text-xs text-gray-500">{item.unit}</td>
                              <td className="py-2 px-3 text-xs text-right">{fmt(item.total_cost)}</td>
                              <td className="py-2 px-3 text-center">
                                <Badge className={`${statusColors[item.delivery_status] || statusColors.pending} text-[9px] border-0`}>{item.delivery_status}</Badge>
                              </td>
                              <td className="py-2 px-3">
                                {user?.role !== 'Client' && <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-[#e31d3b]"><Trash2 className="w-3 h-3" /></button>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Dispatches */}
        <TabsContent value="dispatches" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full"><div className="p-4 space-y-3 max-w-3xl">
            {dispatches.length === 0 ? (
              <div className="text-center py-16"><Truck className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-400">No dispatches yet</p></div>
            ) : dispatches.map((d, i) => (
              <Card key={d.id} className="p-4" data-testid={`dispatch-${i}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-black">{d.material_name}</h3>
                  <Badge className={d.delivery_confirmed ? 'bg-green-50 text-green-700 border-0' : 'bg-blue-50 text-blue-600 border-0'}>{d.delivery_confirmed ? 'Confirmed' : 'Dispatched'}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-[10px] text-gray-500">
                  <div><p className="font-bold uppercase text-gray-400">Qty</p><p className="text-black text-xs">{d.quantity}</p></div>
                  <div><p className="font-bold uppercase text-gray-400">From</p><p className="text-black text-xs">{d.from_location || '—'}</p></div>
                  <div><p className="font-bold uppercase text-gray-400">To</p><p className="text-black text-xs">{d.to_location || '—'}</p></div>
                </div>
                <p className="text-[9px] text-gray-400 mt-2">By {d.dispatched_by} &middot; {d.dispatch_date}</p>
              </Card>
            ))}
          </div></ScrollArea>
        </TabsContent>

        {/* Cost Summary */}
        <TabsContent value="cost" className="flex-1 overflow-hidden m-0">
          <div className="p-4 max-w-2xl">
            <Card className="p-6" data-testid="inv-cost-summary">
              <h3 className="text-sm font-bold text-black mb-4">Cost Summary</h3>
              <div className="space-y-3">
                {[
                  ['Total Purchased Cost', kpi.total_purchased_cost],
                  ['Total Used Cost', kpi.total_used_cost],
                  ['Remaining Stock Value', kpi.remaining_stock_value],
                ].map(([label, val], i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs text-gray-600">{label}</span>
                    <span className="text-sm font-bold text-black">{fmt(val)}</span>
                  </div>
                ))}
                {/* Category breakdown */}
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pt-3">By Category</h4>
                {Object.entries(items.reduce((acc, i) => { acc[i.category] = (acc[i.category] || 0) + (i.total_cost || 0); return acc; }, {})).map(([cat, cost]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{cat}</span>
                    <span className="text-xs font-medium">{fmt(cost)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Material Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg" data-testid="add-material-dialog">
          <DialogHeader><DialogTitle>Add Material</DialogTitle></DialogHeader>
          <AddMaterialForm api={api} projectId={project.id} projectName={project.name}
            onSuccess={() => { setShowAdd(false); loadData(); toast.success('Material added'); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddMaterialForm({ api, projectId, projectName, onSuccess }) {
  const [form, setForm] = useState({ material_name: '', category: 'Civil', vendor_name: '', quantity_purchased: 0, quantity_remaining: 0, unit: 'nos', unit_cost: 0, total_cost: 0, delivery_status: 'pending' });
  const [saving, setSaving] = useState(false);

  const u = (k, v) => {
    const nf = { ...form, [k]: v };
    if (k === 'quantity_purchased' || k === 'unit_cost') {
      nf.total_cost = Number(nf.quantity_purchased) * Number(nf.unit_cost);
      if (k === 'quantity_purchased') nf.quantity_remaining = Number(v);
    }
    setForm(nf);
  };

  const handleSubmit = async () => {
    if (!form.material_name.trim()) { toast.error('Material name required'); return; }
    setSaving(true);
    try { await api.post('/inventory', { ...form, project_id: projectId, project_name: projectName }); onSuccess(); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Material Name *</Label>
          <Input value={form.material_name} onChange={e => u('material_name', e.target.value)} className="mt-1" data-testid="material-name-input" /></div>
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</Label>
          <Select value={form.category} onValueChange={v => u('category', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Vendor</Label>
          <Input value={form.vendor_name} onChange={e => u('vendor_name', e.target.value)} className="mt-1" /></div>
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Delivery Status</Label>
          <Select value={form.delivery_status} onValueChange={v => u('delivery_status', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{DELIVERY_STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Qty Purchased</Label>
          <Input type="number" value={form.quantity_purchased || ''} onChange={e => u('quantity_purchased', e.target.value)} className="mt-1" /></div>
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Unit</Label>
          <Select value={form.unit} onValueChange={v => u('unit', v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{UNITS.map(un => <SelectItem key={un} value={un}>{un}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Unit Cost</Label>
          <Input type="number" value={form.unit_cost || ''} onChange={e => u('unit_cost', e.target.value)} className="mt-1" /></div>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-xs text-gray-600">Total Cost</span>
        <span className="text-sm font-black text-[#ef7f1b]">{fmt(form.total_cost)}</span>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={saving} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="material-submit">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />} Add Material
        </Button>
      </div>
    </div>
  );
}
