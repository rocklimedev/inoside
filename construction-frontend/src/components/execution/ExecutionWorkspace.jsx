import AddReportForm from "./AddReportForm";
import AddTaskForm from "./AddTaskForm";
export default function ExecutionWorkspace({ project, api, user, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [activeTab, setActiveTab] = useState("kanban");
  const isClient = user?.role === "Client";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [t, r, d, tl] = await Promise.all([
        api.get(`/execution/tasks?project_id=${project.id}`),
        api.get(`/execution/daily-reports?project_id=${project.id}`),
        api.get(`/execution/drawings?project_id=${project.id}`),
        api.get(`/execution/timeline/${project.id}`),
      ]);
      setTasks(t.data);
      setReports(r.data);
      setDrawings(d.data);
      setTimeline(tl.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination || isClient) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t)),
    );
    try {
      await api.put(`/execution/tasks/${draggableId}`, { status: newStatus });
    } catch {
      toast.error("Failed to update task");
      loadData();
    }
  };

  const handleDeleteTask = async (tid) => {
    try {
      await api.delete(`/execution/tasks/${tid}`);
      setTasks((p) => p.filter((t) => t.id !== tid));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const kpi = timeline || {
    total_tasks: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    delayed: 0,
    completion_pct: 0,
    today_tasks: 0,
  };
  const openIssues = reports.reduce((s, r) => s + (r.issues_faced ? 1 : 0), 0);

  return (
    <div className="flex flex-col h-full" data-testid="execution-workspace">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-black">{project.name}</h1>
              <p className="text-[11px] text-gray-400">Execution Workspace</p>
            </div>
          </div>
          {!isClient && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddReport(true)}
                data-testid="add-report-btn"
              >
                <FileText className="w-3.5 h-3.5 mr-1" /> Daily Report
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddTask(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                data-testid="add-task-btn"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-4 md:px-6 bg-gray-50/50 border-b border-gray-100">
        {[
          { label: "Today's Tasks", value: kpi.today_tasks, icon: Calendar },
          { label: "In Progress", value: kpi.in_progress, icon: Clock },
          { label: "Completed", value: kpi.completed, icon: CheckCircle },
          { label: "Delayed", value: kpi.delayed, icon: AlertTriangle },
          {
            label: "Progress",
            value: `${kpi.completion_pct}%`,
            icon: TrendingUp,
          },
          { label: "Issues", value: openIssues, icon: AlertTriangle },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <Card
              key={i}
              className="p-3 text-center"
              data-testid={`exec-kpi-${i}`}
            >
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <p className="text-lg font-black text-black">{k.value}</p>
              <p className="text-[9px] text-gray-400">{k.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-4 mt-3 bg-gray-100 p-0.5 rounded-lg w-fit">
          <TabsTrigger value="kanban" className="text-xs px-3 py-1.5">
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs px-3 py-1.5">
            Daily Reports
          </TabsTrigger>
          <TabsTrigger value="drawings" className="text-xs px-3 py-1.5">
            Drawings
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs px-3 py-1.5">
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Kanban */}
        <TabsContent value="kanban" className="flex-1 overflow-hidden m-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-4 h-full overflow-x-auto">
              {COLUMNS.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <Droppable key={col.id} droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-w-[280px] max-w-[360px] rounded-xl border-t-2 ${col.color} ${col.bg} ${snapshot.isDraggingOver ? "ring-2 ring-[#ef7f1b]/20" : ""} flex flex-col`}
                      >
                        <div className="p-3 flex items-center justify-between">
                          <h3 className="text-xs font-bold text-black">
                            {col.title}
                          </h3>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-gray-500 font-medium">
                            {colTasks.length}
                          </span>
                        </div>
                        <ScrollArea className="flex-1 px-3 pb-3">
                          <div className="space-y-2">
                            {colTasks.map((task, idx) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={idx}
                                isDragDisabled={isClient}
                              >
                                {(prov, snap) => (
                                  <div
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    className={`bg-white rounded-lg p-3 border border-gray-100 ${snap.isDragging ? "shadow-lg ring-2 ring-[#ef7f1b]/20" : "shadow-sm"} transition-shadow`}
                                  >
                                    <div className="flex items-start gap-2">
                                      {!isClient && (
                                        <div
                                          {...prov.dragHandleProps}
                                          className="mt-1 text-gray-300 hover:text-gray-500"
                                        >
                                          <GripVertical className="w-3.5 h-3.5" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-black">
                                          {task.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                          <Badge
                                            className={`${(PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium).color} text-[9px] border-0`}
                                          >
                                            {
                                              (
                                                PRIORITY_MAP[task.priority] ||
                                                PRIORITY_MAP.medium
                                              ).label
                                            }
                                          </Badge>
                                          <span className="text-[9px] text-gray-400">
                                            {task.category}
                                          </span>
                                        </div>
                                        {task.assigned_to && (
                                          <p className="text-[9px] text-gray-400 mt-1">
                                            <Users className="w-3 h-3 inline mr-0.5" />{" "}
                                            {task.assigned_to}
                                          </p>
                                        )}
                                        {task.deadline && (
                                          <p className="text-[9px] text-gray-400 mt-0.5">
                                            <Calendar className="w-3 h-3 inline mr-0.5" />{" "}
                                            {task.deadline}
                                          </p>
                                        )}
                                      </div>
                                      {!isClient && (
                                        <button
                                          onClick={() =>
                                            handleDeleteTask(task.id)
                                          }
                                          className="text-gray-300 hover:text-[#e31d3b] shrink-0"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </TabsContent>

        {/* Daily Reports */}
        <TabsContent value="reports" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3 max-w-3xl">
              {reports.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No daily reports yet</p>
                </div>
              ) : (
                reports.map((r, i) => (
                  <Card
                    key={r.id}
                    className="p-4"
                    data-testid={`report-card-${i}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-black">{r.date}</h3>
                      <span className="text-[10px] text-gray-400">
                        by {r.created_by}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {r.work_executed && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Work Executed
                          </p>
                          <p className="text-black">{r.work_executed}</p>
                        </div>
                      )}
                      {r.manpower_count && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Manpower
                          </p>
                          <p className="text-black">{r.manpower_count}</p>
                        </div>
                      )}
                      {r.materials_used && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Materials
                          </p>
                          <p className="text-black">{r.materials_used}</p>
                        </div>
                      )}
                      {r.progress_notes && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            Notes
                          </p>
                          <p className="text-black">{r.progress_notes}</p>
                        </div>
                      )}
                      {r.issues_faced && (
                        <div className="col-span-2">
                          <p className="text-[10px] text-[#e31d3b] font-bold uppercase">
                            Issues
                          </p>
                          <p className="text-black">{r.issues_faced}</p>
                        </div>
                      )}
                    </div>
                    {(r.site_photos || []).length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {r.site_photos.map((p, j) => (
                          <img
                            key={j}
                            src={`${BACKEND}${p.url}`}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          />
                        ))}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Drawings */}
        <TabsContent value="drawings" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {drawings.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No execution drawings</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drawings.map((d, i) => (
                    <Card
                      key={d.id}
                      className="p-4"
                      data-testid={`drawing-card-${i}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xs font-bold text-black">
                          {d.title}
                        </h3>
                        <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                          {d.version}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {d.category} &middot; {d.area_floor}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">
                          by {d.uploaded_by}
                        </span>
                        {d.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() =>
                              window.open(`${BACKEND}${d.file_url}`, "_blank")
                            }
                          >
                            <Download className="w-3 h-3 mr-1" /> PDF
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="flex-1 overflow-hidden m-0">
          <div className="p-4 max-w-2xl">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-black mb-4">
                Project Execution Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      Overall Progress
                    </span>
                    <span className="text-sm font-black text-[#ef7f1b]">
                      {kpi.completion_pct}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ef7f1b] rounded-full transition-all duration-700"
                      style={{ width: `${kpi.completion_pct}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Total Tasks
                    </p>
                    <p className="text-lg font-black text-black">
                      {kpi.total_tasks}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Completed
                    </p>
                    <p className="text-lg font-black text-green-600">
                      {kpi.completed}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      In Progress
                    </p>
                    <p className="text-lg font-black text-[#ef7f1b]">
                      {kpi.in_progress}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                      Delayed
                    </p>
                    <p className="text-lg font-black text-[#e31d3b]">
                      {kpi.delayed}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="max-w-md" data-testid="add-task-dialog">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <AddTaskForm
            api={api}
            projectId={project.id}
            projectName={project.name}
            onSuccess={(t) => {
              setTasks((p) => [...p, t]);
              setShowAddTask(false);
              toast.success("Task added");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Add Daily Report Dialog */}
      <Dialog open={showAddReport} onOpenChange={setShowAddReport}>
        <DialogContent className="max-w-lg" data-testid="add-report-dialog">
          <DialogHeader>
            <DialogTitle>Daily Progress Report</DialogTitle>
          </DialogHeader>
          <AddReportForm
            api={api}
            projectId={project.id}
            onSuccess={(r) => {
              setReports((p) => [r, ...p]);
              setShowAddReport(false);
              toast.success("Report submitted");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
