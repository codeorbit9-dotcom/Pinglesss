import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

interface AnalyticsChartsProps {
  timeData: any[];
  distData: any[];
  theme: 'light' | 'dark';
  colors: string[];
}

export const ThroughputChart: React.FC<{data: any[], theme: string}> = ({ data, theme }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} vertical={false} />
      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: theme === 'dark' ? '#020617' : '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
        }}
      />
      <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
      <Area type="monotone" dataKey="blocked" stroke="#f43f5e" strokeWidth={3} fillOpacity={0.1} />
    </AreaChart>
  </ResponsiveContainer>
);

export const SecurityPieChart: React.FC<{data: any[], theme: string, colors: string[]}> = ({ data, theme, colors }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={85}
        paddingAngle={8}
        dataKey="value"
        stroke={theme === 'dark' ? '#020617' : '#fff'}
        strokeWidth={4}
        animationDuration={1000}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);