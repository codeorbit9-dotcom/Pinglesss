import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface DashboardChartProps {
  data: any[];
  theme: 'light' | 'dark';
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data, theme }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip 
          cursor={{ stroke: '#4F46E5', strokeWidth: 2 }}
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', 
            border: '1px solid rgba(79, 70, 229, 0.2)', 
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            padding: '10px'
          }}
        />
        <Area type="monotone" dataKey="req" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" animationDuration={1000} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;