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
import Modal from "../components/Modal/Modal";
import { DataGrid } from "@mui/x-data-grid";

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
  const [dailyStatModal, setDailyStatModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<Assignment[]>([]);
  const [modalLoading, setModalLoading] = useState(false);


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
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.statusName === "Done"
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
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.priorityName === "High"
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

  const gridColumns = [
  { field: "ticketID", headerName: "ID", flex: 1 },

  { field: "title", headerName: "Title", flex: 1 },

  {
    field: "description",
    headerName: "Description",
    flex: 2,
    renderCell: (params) =>
      params.value?.length > 50
        ? params.value.slice(0, 50) + "..."
        : params.value,
  },

  {
    field: "statusName",
    headerName: "Status",
    flex: 1.5,
    renderCell: (params) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.value === "Done"
            ? "bg-green-100 text-green-700"
            : params.value === "In Progress"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {params.value}
      </span>
    ),
  },

  {
    field: "priorityName",
    headerName: "Priority",
    flex: 1.5,
    renderCell: (params) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.value === "High"
            ? "bg-red-100 text-red-700"
            : params.value === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {params.value}
      </span>
    ),
  },

  {
    field: "createdAt",
    headerName: "Created At",
    flex: 1.5,
    valueFormatter: (params) =>
      new Date(params.value as string).toLocaleString(),
  },
];

const gridRows = modalData.map((row) => ({
  id: row.ticketID,
  ...row,
}));



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

  const openModalwithDailyStat = async (title: string, apiCall: () => Promise<any>) => {
    try {
      setModalTitle(title);
      setIsModalOpen(true);
      setModalLoading(true);

      const res = await apiCall();

      if (res.data.isSucceed) {
        setModalData(res.data.data || []);
      } else {
        setModalData([]);
      }
      console.log(modalData)
    } catch (err) {
      console.error(err);
      setModalData([]);
    } finally {
      setModalLoading(false);
    }
  }

  /* =======================
     Render
  ======================= */

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={modalTitle}
  size="xl"
  >
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={modalTitle}
  size="xl"
>
  <div style={{ height: 500, width: "100%" }}>
    <DataGrid
      rows={gridRows}
      columns={gridColumns}
      loading={modalLoading}
      pageSizeOptions={[5, 10, 20]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10, page: 0 } },
      }}
      disableRowSelectionOnClick
    />
  </div>
</Modal>


    </Modal>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Today Assignment" value={stats.totalAssignment} color="bg-blue-100 text-blue-600" onClick={()=>openModalwithDailyStat("Today Assignment",TicketDashboardApi.getTodayAssignmentList)} />
        <StatCard title="Today Solved" value={stats.totalSolved} color="bg-green-100 text-green-600"  onClick={()=>openModalwithDailyStat("Today Solved",TicketDashboardApi.getSolvedList)}  />
        <StatCard title="In Progress" value={stats.totalInProgress} color="bg-sky-100 text-sky-600" onClick={()=>openModalwithDailyStat("In Progress",TicketDashboardApi.getProgressList)}  />
        <StatCard title="Pending" value={stats.totalPending} color="bg-orange-100 text-orange-600" onClick={()=>openModalwithDailyStat("Pending",TicketDashboardApi.getPendingList)}  />
        <StatCard title="Today's Active Task" value={stats.todaysActiveTask} color="bg-emerald-100 text-emerald-600" onClick={()=>openModalwithDailyStat("Today Active Task",TicketDashboardApi.getTodayActiveList)}  />
        <StatCard title="Today Deadline" value={stats.todaysDeadline} color="bg-red-100 text-red-600" onClick={()=>openModalwithDailyStat("Today Deadline",TicketDashboardApi.getTodayDeadlineList)}  />
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
