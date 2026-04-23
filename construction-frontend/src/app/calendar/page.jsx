import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, CalendarDays,
  LayoutGrid, List, Columns3, Calendar as CalIcon, Loader2, Trash2, Edit3, GripVertical
} from 'lucide-react';

const CATEGORIES = [
  { id: 'client_meeting', label: 'Client Meetings', color: '#ef7f1b' },
  { id: 'site_visit', label: 'Site Visits', color: '#3b82f6' },
  { id: 'deadline', label: 'Deadlines', color: '#e31d3b' },
  { id: 'design_review', label: 'Design Reviews', color: '#8b5cf6' },
  { id: 'internal_meeting', label: 'Internal Meetings', color: '#6b7280' },
  { id: 'vendor_meeting', label: 'Vendor Meetings', color: '#f59e0b' },
  { id: 'inspection', label: 'Inspections', color: '#10b981' },
];
const VIEWS = [
  { id: 'month', label: 'Month', icon: CalIcon },
  { id: 'week', label: 'Week', icon: Columns3 },
  { id: 'day', label: 'Day', icon: CalendarDays },
  { id: 'tiles', label: 'Tiles', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: List },
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }
function isSameDay(d1, d2) { return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate(); }
function formatTime(iso) { const d = new Date(iso); return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); }
function formatDate(iso) { return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CalendarPage() {
  const { api } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeCategories, setActiveCategories] = useState(CATEGORIES.map(c => c.id));
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', project: '', client: '', location: '', start_time: '', end_time: '', participants: [], description: '', category: 'client_meeting', color: '#ef7f1b' });
  const [dragEvent, setDragEvent] = useState(null);

  useEffect(() => { fetchEvents(); }, []);
  const fetchEvents = async () => {
    try { const res = await api.get('/calendar/events'); setEvents(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filteredEvents = useMemo(() => events.filter(e => activeCategories.includes(e.category)), [events, activeCategories]);
  const toggleCategory = (id) => setActiveCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const openCreateDialog = () => {
    setEditingEvent(null);
    setForm({ title: '', project: '', client: '', location: '', start_time: '', end_time: '', participants: [], description: '', category: 'client_meeting', color: '#ef7f1b' });
    setShowEventDialog(true);
  };

  const openEditDialog = (evt) => {
    setEditingEvent(evt);
    setForm({
      title: evt.title || '', project: evt.project || '', client: evt.client || '',
      location: evt.location || '', start_time: toLocalInput(evt.start_time), end_time: toLocalInput(evt.end_time),
      participants: evt.participants || [], description: evt.description || '',
      category: evt.category || 'client_meeting', color: evt.color || '#ef7f1b'
    });
    setShowEventDialog(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.start_time || !form.end_time) { toast.error('Title and times required'); return; }
    setSaving(true);
    try {
      const cat = CATEGORIES.find(c => c.id === form.category);
      const payload = { ...form, color: cat?.color || '#ef7f1b' };
      if (editingEvent) {
        const res = await api.put(`/calendar/events/${editingEvent.id}`, payload);
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? res.data : e));
        toast.success('Event updated');
      } else {
        const res = await api.post('/calendar/events', payload);
        setEvents(prev => [...prev, res.data]);
        toast.success('Event created');
      }
      setShowEventDialog(false);
      setEditingEvent(null);
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    try {
      await api.delete(`/calendar/events/${editingEvent.id}`);
      setEvents(prev => prev.filter(e => e.id !== editingEvent.id));
      setShowEventDialog(false);
      setEditingEvent(null);
      toast.success('Event deleted');
    } catch { toast.error('Failed'); }
  };

  // Drag-and-drop handler for month view
  const handleDrop = async (evt, targetDate) => {
    if (!evt) return;
    const oldStart = new Date(evt.start_time);
    const oldEnd = new Date(evt.end_time);
    const duration = oldEnd - oldStart;
    const newStart = new Date(targetDate.year, targetDate.month, targetDate.date, oldStart.getHours(), oldStart.getMinutes());
    const newEnd = new Date(newStart.getTime() + duration);
    const pad = n => String(n).padStart(2, '0');
    const formatISO = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    try {
      const res = await api.put(`/calendar/events/${evt.id}`, { start_time: formatISO(newStart), end_time: formatISO(newEnd) });
      setEvents(prev => prev.map(e => e.id === evt.id ? res.data : e));
      toast.success('Event moved');
    } catch { toast.error('Failed to move event'); }
    setDragEvent(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date();

  const monthGrid = useMemo(() => {
    const days = []; const first = getFirstDay(year, month); const dim = getDaysInMonth(year, month); const prevDim = getDaysInMonth(year, month - 1);
    for (let i = first - 1; i >= 0; i--) days.push({ date: prevDim - i, month: month - 1, year: month === 0 ? year - 1 : year, isOther: true });
    for (let i = 1; i <= dim; i++) days.push({ date: i, month, year, isOther: false });
    const rem = 42 - days.length; for (let i = 1; i <= rem; i++) days.push({ date: i, month: month + 1, year: month === 11 ? year + 1 : year, isOther: true });
    return days;
  }, [year, month]);

  const getEventsForDate = (d) => filteredEvents.filter(e => { const ed = new Date(e.start_time); return ed.getDate() === d.date && ed.getMonth() === d.month && ed.getFullYear() === d.year; });

  const weekDates = useMemo(() => {
    const start = new Date(selectedDate); start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [selectedDate]);

  const getEventsForDay = (date) => filteredEvents.filter(e => isSameDay(new Date(e.start_time), date));

  if (loading) return <div className="flex items-center justify-center h-full min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" /></div>;

  return (
    <div className="flex h-full" data-testid="calendar-page">
      {/* Left Sidebar */}
      <div className="hidden lg:flex flex-col w-60 border-r border-gray-200 bg-white p-4 shrink-0">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold">{MONTHS[month]} {year}</span>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0">
            {DAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-gray-400 py-1">{d[0]}</div>)}
            {monthGrid.map((d, i) => {
              const isToday = !d.isOther && d.date === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();
              const isSelected = !d.isOther && d.date === selectedDate.getDate() && d.month === selectedDate.getMonth();
              const hasEvents = getEventsForDate(d).length > 0;
              return (
                <button key={i} onClick={() => !d.isOther && setSelectedDate(new Date(d.year, d.month, d.date))}
                  className={`w-7 h-7 text-[10px] rounded-full flex items-center justify-center relative transition-colors
                    ${d.isOther ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                    ${isToday ? 'bg-[#ef7f1b] text-white font-bold' : ''}
                    ${isSelected && !isToday ? 'border border-[#ef7f1b] text-[#ef7f1b] font-bold' : ''}`}>
                  {d.date}
                  {hasEvents && !isToday && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#ef7f1b]" />}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Categories</p>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={activeCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)}
                  className="data-[state=checked]:border-transparent" style={{ backgroundColor: activeCategories.includes(cat.id) ? cat.color : undefined, borderColor: cat.color }} />
                <span className="text-xs text-gray-600">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="text-xs font-medium text-[#ef7f1b] border border-[#ef7f1b]/30 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors" data-testid="today-btn">Today</button>
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
            <h2 className="text-lg font-bold text-black">{MONTHS[month]} {year}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              {VIEWS.map(v => (
                <button key={v.id} onClick={() => setViewMode(v.id)} data-testid={`cal-view-${v.id}`}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === v.id ? 'bg-[#ef7f1b] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{v.label}</button>
              ))}
            </div>
            <Button onClick={openCreateDialog} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" size="sm" data-testid="new-event-btn">
              <Plus className="w-4 h-4 mr-1" /> New Event
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {viewMode === 'month' && <MonthView grid={monthGrid} today={today} selectedDate={selectedDate} onSelectDate={d => setSelectedDate(new Date(d.year, d.month, d.date))} getEvents={getEventsForDate} onEventClick={openEditDialog} dragEvent={dragEvent} setDragEvent={setDragEvent} onDrop={handleDrop} />}
          {viewMode === 'week' && <WeekView dates={weekDates} today={today} getEvents={getEventsForDay} onEventClick={openEditDialog} />}
          {viewMode === 'day' && <DayView date={selectedDate} events={getEventsForDay(selectedDate)} onEventClick={openEditDialog} />}
          {viewMode === 'tiles' && <TilesView events={filteredEvents} onEventClick={openEditDialog} />}
          {viewMode === 'list' && <ListViewCal events={filteredEvents} onEventClick={openEditDialog} />}
        </ScrollArea>
      </div>

      {/* Event Dialog (Create / Edit) */}
      <Dialog open={showEventDialog} onOpenChange={v => { if (!v) { setShowEventDialog(false); setEditingEvent(null); } }}>
        <DialogContent className="max-w-lg" data-testid="event-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingEvent ? 'Edit Event' : 'New Event'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="mt-1" data-testid="ne-title" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Project</Label>
                <Input value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                </Select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Start *</Label>
                <Input type="datetime-local" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="mt-1" data-testid="ne-start" /></div>
              <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">End *</Label>
                <Input type="datetime-local" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} className="mt-1" data-testid="ne-end" /></div>
            </div>
            <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1" /></div>
            <div><Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="mt-1" rows={2} /></div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <div>
              {editingEvent && (
                <Button variant="destructive" size="sm" onClick={handleDelete} data-testid="event-delete-btn">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setShowEventDialog(false); setEditingEvent(null); }}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white" data-testid="ne-submit">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MonthView({ grid, today, selectedDate, onSelectDate, getEvents, onEventClick, dragEvent, setDragEvent, onDrop }) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-7 border-l border-t border-gray-200">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-2 border-r border-b border-gray-200 bg-gray-50">{d}</div>)}
        {grid.map((d, i) => {
          const evts = getEvents(d);
          const isToday = !d.isOther && d.date === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();
          const isSelected = !d.isOther && d.date === selectedDate.getDate() && d.month === selectedDate.getMonth();
          return (
            <div key={i}
              onClick={() => !d.isOther && onSelectDate(d)}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('bg-orange-50'); }}
              onDragLeave={e => { e.currentTarget.classList.remove('bg-orange-50'); }}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('bg-orange-50'); if (dragEvent && !d.isOther) onDrop(dragEvent, d); }}
              className={`min-h-[90px] p-1.5 border-r border-b border-gray-200 cursor-pointer transition-colors hover:bg-orange-50/30 ${d.isOther ? 'bg-gray-50/50' : 'bg-white'} ${isSelected ? 'ring-1 ring-inset ring-[#ef7f1b]/40' : ''}`}>
              <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full mb-1 ${isToday ? 'bg-[#ef7f1b] text-white font-bold' : d.isOther ? 'text-gray-300' : 'text-gray-700'}`}>{d.date}</span>
              <div className="space-y-0.5">
                {evts.slice(0, 3).map((e, ei) => (
                  <div key={ei}
                    draggable
                    onDragStart={(ev) => { ev.stopPropagation(); setDragEvent(e); }}
                    onDragEnd={() => setDragEvent(null)}
                    onClick={ev => { ev.stopPropagation(); onEventClick(e); }}
                    className="text-[9px] px-1.5 py-0.5 rounded truncate font-medium cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow flex items-center gap-0.5"
                    style={{ backgroundColor: `${e.color}15`, color: e.color }}
                    data-testid={`event-chip-${e.id}`}>
                    <GripVertical className="w-2 h-2 opacity-40 shrink-0" />
                    {e.title}
                  </div>
                ))}
                {evts.length > 3 && <span className="text-[9px] text-gray-400 px-1">+{evts.length - 3} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ dates, today, getEvents, onEventClick }) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  return (
    <div className="p-4">
      <div className="grid grid-cols-8 border-l border-t border-gray-200">
        <div className="border-r border-b border-gray-200 bg-gray-50" />
        {dates.map((d, i) => (
          <div key={i} className={`text-center py-2 border-r border-b border-gray-200 ${isSameDay(d, today) ? 'bg-orange-50' : 'bg-gray-50'}`}>
            <p className="text-[10px] font-bold text-gray-400">{DAYS[d.getDay()]}</p>
            <p className={`text-sm font-bold ${isSameDay(d, today) ? 'text-[#ef7f1b]' : 'text-black'}`}>{d.getDate()}</p>
          </div>
        ))}
        {hours.map(h => (
          <React.Fragment key={h}>
            <div className="text-[10px] text-gray-400 text-right pr-2 py-2 border-r border-b border-gray-200 h-14">{h > 12 ? h - 12 : h}{h >= 12 ? 'pm' : 'am'}</div>
            {dates.map((d, di) => {
              const dayEvents = getEvents(d).filter(e => new Date(e.start_time).getHours() === h);
              return (
                <div key={di} className="border-r border-b border-gray-200 h-14 p-0.5 relative">
                  {dayEvents.map((e, ei) => (
                    <div key={ei} onClick={() => onEventClick(e)}
                      className="text-[9px] px-1 py-0.5 rounded truncate font-medium cursor-pointer hover:shadow-sm transition-shadow"
                      style={{ backgroundColor: `${e.color}20`, color: e.color, borderLeft: `2px solid ${e.color}` }}>{e.title}</div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DayView({ date, events, onEventClick }) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  return (
    <div className="p-4">
      <h3 className="text-sm font-bold text-black mb-4">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3>
      <div className="space-y-0">
        {hours.map(h => {
          const hourEvents = events.filter(e => new Date(e.start_time).getHours() === h);
          return (
            <div key={h} className="flex border-b border-gray-100 min-h-[60px]">
              <div className="w-20 text-xs text-gray-400 text-right pr-3 py-2 shrink-0">{h > 12 ? h - 12 : h}:00 {h >= 12 ? 'PM' : 'AM'}</div>
              <div className="flex-1 p-1 space-y-1">
                {hourEvents.map((e, i) => (
                  <div key={i} onClick={() => onEventClick(e)} className="p-2 rounded-lg text-sm cursor-pointer hover:shadow-md transition-shadow" style={{ backgroundColor: `${e.color}10`, borderLeft: `3px solid ${e.color}` }}>
                    <p className="font-medium text-black">{e.title}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(e.start_time)} - {formatTime(e.end_time)}</span>
                      {e.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>}
                      {e.project && <span>{e.project}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TilesView({ events, onEventClick }) {
  const sorted = [...events].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sorted.map((e, i) => (
        <Card key={i} onClick={() => onEventClick(e)} className="p-4 hover:shadow-md transition-all cursor-pointer border-l-[3px]" style={{ borderLeftColor: e.color }} data-testid={`tile-event-${i}`}>
          <h3 className="text-sm font-bold text-black mb-1">{e.title}</h3>
          <div className="space-y-1 text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{formatDate(e.start_time)} {formatTime(e.start_time)} - {formatTime(e.end_time)}</div>
            {e.project && <div>{e.project}</div>}
            {e.location && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{e.location}</div>}
            {e.participants?.length > 0 && <div className="flex items-center gap-1.5"><Users className="w-3 h-3" />{e.participants.join(', ')}</div>}
          </div>
          <Badge className="mt-2 text-[10px] h-[18px] border" style={{ backgroundColor: `${e.color}15`, color: e.color, borderColor: `${e.color}30` }}>
            {CATEGORIES.find(c => c.id === e.category)?.label || e.category}
          </Badge>
        </Card>
      ))}
    </div>
  );
}

function ListViewCal({ events, onEventClick }) {
  const sorted = [...events].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  const grouped = sorted.reduce((acc, e) => {
    const key = new Date(e.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-4">
      {Object.entries(grouped).map(([date, evts]) => (
        <div key={date}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{date}</h3>
          <div className="space-y-1.5">
            {evts.map((e, i) => (
              <div key={i} onClick={() => onEventClick(e)} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer">
                <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                <div className="w-20 shrink-0 text-xs text-gray-500">{formatTime(e.start_time)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{e.title}</p>
                  <p className="text-[10px] text-gray-400">{[e.project, e.location].filter(Boolean).join(' · ')}</p>
                </div>
                <Edit3 className="w-3.5 h-3.5 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
