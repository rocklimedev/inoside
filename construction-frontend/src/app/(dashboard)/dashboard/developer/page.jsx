"use client";

import {
  Activity,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Network,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  useGetSystemOverviewQuery,
  useGetHealthQuery,
  useGetVersionQuery,
  useGetCdnStatusQuery,
  useGetReadyStatusQuery,
  useGetLiveStatusQuery,
} from "@/api/systemApi";

// Mock Chart Data
const memoryData = [
  { time: "1m", usage: 35 },
  { time: "2m", usage: 42 },
  { time: "3m", usage: 38 },
  { time: "4m", usage: 51 },
  { time: "5m", usage: 46 },
  { time: "6m", usage: 58 },
  { time: "7m", usage: 54 },
];

const requestData = [
  { time: "1m", value: 120 },
  { time: "2m", value: 180 },
  { time: "3m", value: 150 },
  { time: "4m", value: 240 },
  { time: "5m", value: 210 },
  { time: "6m", value: 320 },
  { time: "7m", value: 280 },
];

export default function DeveloperDashboardPage() {
  const { data: overview, isLoading: loadingOverview } =
    useGetSystemOverviewQuery();
  const { data: health, isLoading: loadingHealth } = useGetHealthQuery();
  const { data: version, isLoading: loadingVersion } = useGetVersionQuery();
  const { data: cdn, isLoading: loadingCdn } = useGetCdnStatusQuery();
  const { data: ready } = useGetReadyStatusQuery();
  const { data: live } = useGetLiveStatusQuery();

  const loading =
    loadingOverview || loadingHealth || loadingVersion || loadingCdn;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-orange-600 border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const services = overview?.services || {};
  const memory = health?.memory || {};

  const heapUsed = memory?.heap_used || 0;
  const heapTotal = memory?.heap_total || 1;
  const memoryPercent = Math.min((heapUsed / heapTotal) * 100, 100);

  const kpis = [
    {
      label: "Environment",
      value: overview?.application?.environment || "-",
      icon: Server,
      status: "Healthy",
    },
    {
      label: "Server",
      value: overview?.server?.status || "-",
      icon: Activity,
      status: "Operational",
    },
    {
      label: "Database",
      value: health?.database?.status || "-",
      icon: Database,
      status: "Connected",
    },
    {
      label: "CDN",
      value: cdn?.cdn?.enabled ? "Enabled" : "Disabled",
      icon: Globe,
      status: cdn?.cdn?.enabled ? "Active" : "Inactive",
    },
    {
      label: "Container",
      value: ready?.ready ? "Ready" : "Not Ready",
      icon: ShieldCheck,
      status: ready?.ready ? "Healthy" : "Issue",
    },
    {
      label: "Runtime",
      value: live?.live ? "Live" : "Down",
      icon: Workflow,
      status: live?.live ? "Online" : "Offline",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Developer Dashboard
            </h1>
            <p className="text-gray-500">Infrastructure Monitoring</p>
          </div>
        </div>

        <Badge className="bg-green-600 text-white px-4 py-1.5">
          All Systems Operational
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpis.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold mt-2 text-gray-900">
                    {item.value}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-600 font-medium">
                {item.status}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Memory Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Memory Usage</h2>
              <p className="text-sm text-gray-500">Runtime heap consumption</p>
            </div>
            <Cpu className="w-6 h-6 text-orange-600" />
          </div>

          <div className="space-y-4 mb-6">
            <MetricRow label="RSS" value={formatBytes(memory?.rss || 0)} />
            <MetricRow
              label="Heap Total"
              value={formatBytes(memory?.heap_total || 0)}
            />
            <MetricRow
              label="Heap Used"
              value={formatBytes(memory?.heap_used || 0)}
            />
            <MetricRow
              label="External"
              value={formatBytes(memory?.external || 0)}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Heap Utilization</span>
              <span className="font-medium">{memoryPercent.toFixed(0)}%</span>
            </div>
            <Progress value={memoryPercent} className="h-2" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#f97316"
                  fill="#fed7aa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* API Traffic */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">API Traffic</h2>
              <p className="text-sm text-gray-500">Requests per minute</p>
            </div>
            <Network className="w-6 h-6 text-blue-600" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <SmallMetric label="Req/sec" value="128" />
            <SmallMetric label="Latency" value="84ms" />
            <SmallMetric label="Errors" value="0.02%" />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#bfdbfe"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Services */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-gray-600" />
          <div>
            <h2 className="text-lg font-semibold">Services</h2>
            <p className="text-sm text-gray-500">Real-time service status</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Object.entries(services).map(([key, value]) => (
            <div key={key} className="border rounded-xl p-5 bg-white">
              <div className="flex justify-between items-start">
                <div
                  className={`w-3 h-3 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`}
                />
                {value ? (
                  <span className="text-green-600 text-xl">✓</span>
                ) : (
                  <span className="text-red-600 text-xl">✕</span>
                )}
              </div>
              <h3 className="font-medium mt-6 text-gray-900">{key}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {value ? "Operational" : "Unavailable"}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-5">System Info</h2>
          <div className="space-y-5">
            <InfoRow label="Application" value={overview?.application?.name} />
            <InfoRow label="API Version" value={version?.version?.api} />
            <InfoRow label="Node Version" value={version?.version?.node} />
            <InfoRow label="Platform" value={health?.process?.platform} />
            <InfoRow label="PID" value={health?.process?.pid} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-5">Runtime Stats</h2>
          <div className="space-y-6">
            <BigMetric
              label="Server Uptime"
              value={`${Math.floor((overview?.server?.uptime_seconds || 0) / 60)}m`}
            />
            <BigMetric label="ORM" value={health?.database?.orm} />
            <BigMetric label="Database" value={health?.database?.engine} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-5">CDN Configuration</h2>
          <div className="space-y-5">
            <InfoRow label="Provider" value={cdn?.cdn?.provider} />
            <InfoRow label="Domain" value={cdn?.cdn?.domain} />
            <InfoRow label="Upload API" value={cdn?.cdn?.upload_api} />
            <InfoRow
              label="Storage"
              value={`${cdn?.cdn?.storage?.type} (${cdn?.cdn?.storage?.path})`}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Helper Components */
function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SmallMetric({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function BigMetric({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-lg">{value || "-"}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-3 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-medium text-gray-900">{value || "-"}</span>
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}
