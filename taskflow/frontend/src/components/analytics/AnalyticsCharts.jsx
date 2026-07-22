import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AnalyticsCharts = ({ analytics }) => {
  if (!analytics) return null;

  const { categoryCounts = {}, priorityCounts = {}, weeklyData = [] } = analytics;

  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const barData = Object.keys(priorityCounts).map((pri) => ({
    name: pri,
    tasks: priorityCounts[pri]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 text-left">
      {/* Weekly Activity Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-4">Weekly Task Completion vs Creation</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="created" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Created" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-4">Category Distribution</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
