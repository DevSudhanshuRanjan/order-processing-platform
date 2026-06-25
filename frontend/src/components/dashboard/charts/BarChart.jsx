import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import clsx from 'clsx';

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a2333] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md text-white text-sm">
        <p className="font-label-sm text-on-primary-container mb-1">{label}</p>
        <p className="font-bold text-[#3B82F6]">
          {prefix}{payload[0].value.toLocaleString()}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

const BarChart = ({ 
  data, 
  xKey = 'name', 
  yKey = 'value',
  height = 300,
  prefix = '',
  suffix = '',
  color = '#3B82F6',
  className 
}) => {
  return (
    <div className={clsx("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey={xKey} 
            stroke="rgba(255,255,255,0.2)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `${prefix}${value}${suffix}`}
          />
          <Tooltip content={<CustomTooltip prefix={prefix} suffix={suffix} />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || color} />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
