import { useEffect, useState } from "react";
import StatCard from "../components/Card/StatCard";
import { TicketDashboardApi } from "../src/api/dashboardApi";
import { RechartsDevtools } from "@recharts/devtools";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import VirtualizedTable, {
  type Column,
} from "../components/Table/VirtualizedTable";

/* =======================
   Types
======================= */

interface DashboardStats {
  totalAssignment: number;
  totalSolved: number;
  totalInProgress: number;
  totalPending: number;
  totalStories: number;
  todaysActiveTask: number;
  todaysDeadline: number;
}

interface Assignment {
  ticketID: number;
  title: string;
  description: string;
  statusName: string;
  priorityName: string;
  createdAt: string;
  totalRecords: string;
}

interface DailyStatusStats {
  dayName: string;
  stories: number;
  todo: number;
  inProgress: number;
  testing: number;
  done: number;
}

interface PriorityData {
  priorityID: number;
  priorityName: string;
  ticketCount: number;
}


/* =======================
   Component
======================= */

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyAssignments, setDailyAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState<DailyStatusStats[]>([]);
  const [priorityData, setPriorityData] = useState<PriorityData[]>([]);


  /* =======================
     Table Columns
  ======================= */

  const columns: Column<Assignment>[] = [
    { label: "ID", field: "ticketID", flex: 1, sortable: true },
    { label: "Title", field: "title", flex: 1, sortable: true },
    {
      label: "Description",
      field: "description",
      flex: 2,
      render: (row) =>
        row.description.length > 50
          ? row.description.slice(0, 50) + "..."
          : row.description,
    },
    {
      label: "Status",
      field: "statusName",
      flex: 2,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.statusName === "Done"
              ? "bg-green-100 text-green-700"
              : row.statusName === "In Progress"
              ? "bg-blue-100 text-blue-700"
              : row.statusName === "Stories"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.statusName}
        </span>
      ),
    },
    {
      label: "Priority",
      field: "priorityName",
      flex: 2,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.priorityName === "High"
              ? "bg-red-100 text-red-700"
              : row.priorityName === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : row.priorityName === "Low"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.priorityName}
        </span>
      ),
    },
    {
      label: "Created At",
      field: "createdAt",
      flex: 2,
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      label: "Total Records",
      field: "totalRecords",
      flex: 2,
      sortable: true,
    },
  ];

  /* =======================
     Chart Colors
  ======================= */

// const priorityColors = {
//   Informational: '#2196F3',
//   Low: '#4CAF50',
//   Medium: '#FFC107',
//   High: '#FF9800',
//   Critical: '#F44336'
// };

  /* =======================
     Data Fetch
  ======================= */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, assignmentRes, dailyTrendRes, priorityRes] = await Promise.all([
          TicketDashboardApi.getSummary(),
          TicketDashboardApi.getTicketAssignmentStats(),
          TicketDashboardApi.getDailyTrends(),
          TicketDashboardApi.getWorkLoadPriority(),
        ]);

        setStats(summaryRes.data);
        setDailyAssignments(assignmentRes.data.data.items || []);
        setChartData(dailyTrendRes.data.data); 
        setPriorityData(priorityRes.data.data);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error || !stats)
    return <div className="p-6 text-red-600">{error}</div>;

  /* =======================
     Render
  ======================= */

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Today Assignment" value={stats.totalAssignment} color="bg-blue-100 text-blue-600" />
        <StatCard title="Today Solved" value={stats.totalSolved} color="bg-green-100 text-green-600" />
        <StatCard title="In Progress" value={stats.totalInProgress} color="bg-sky-100 text-sky-600" />
        <StatCard title="Pending" value={stats.totalPending} color="bg-orange-100 text-orange-600" />
        <StatCard title="Today's Active Task" value={stats.todaysActiveTask} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Today Deadline" value={stats.todaysDeadline} color="bg-red-100 text-red-600" />
      </div>

      {/* Table + Charts */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Table */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow p-4 lg:p-6 h-[400px]">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Today’s Assignments
          </h2>

          <VirtualizedTable
            data={dailyAssignments}
            columns={columns}
            rowHeight={56}
            height={320}
            loading={loading}
          />
        </div>

        {/* Charts */}
<div className="flex-1 min-w-0 bg-white rounded-xl shadow p-4 lg:p-6 h-[800px]">
  <h2 className="text-lg font-semibold mb-4 text-slate-700">
    Analytics Overview
  </h2>

  <div className="grid grid-rows-2 gap-4 h-[calc(100%-2rem)]">
    {/* Line Chart */}
    <div className="bg-slate-50 rounded-lg p-3">
      <h3 className="text-sm font-medium mb-2 text-slate-600">
        Assignment Trend
      </h3>

   <ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="dayName" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Legend />

    <Line type="monotone" dataKey="stories" stroke="#8b5cf6" strokeWidth={2} />
    <Line type="monotone" dataKey="todo" stroke="#64748b" strokeWidth={2} />
    <Line type="monotone" dataKey="inProgress" stroke="#0ea5e9" strokeWidth={2} />
    <Line type="monotone" dataKey="testing" stroke="#f59e0b" strokeWidth={2} />
    <Line type="monotone" dataKey="done" stroke="#22c55e" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

    </div>



    {/* Bar Chart */}
    <div className="bg-slate-50 rounded-lg p-3  ">
      <h3 className="text-sm font-medium mb-2 text-slate-600">
        Assignment Volume
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={priorityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priorityName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="ticketCount" fill="lightblue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      </div>

      <RechartsDevtools />
    </div>
  );
}
