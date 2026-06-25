import React from 'react';
import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a2333] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md text-white text-sm">
        <p className="font-label-sm text-on-primary-container mb-1">{label}</p>
        <p className="font-bold text-[#dce2f7]">
          {prefix}{payload[0].value.toLocaleString()}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

const AreaChart = ({ 
  data, 
  xKey = 'name', 
  yKey = 'value',
  height = 300,
  prefix = '',
  suffix = '',
  className 
}) => {
  return (
    <div className={clsx("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsArea data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dce2f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#dce2f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Tooltip content={<CustomTooltip prefix={prefix} suffix={suffix} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke="#dce2f7" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, fill: '#ffffff', stroke: '#1a1c1c', strokeWidth: 2 }}
          />
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
