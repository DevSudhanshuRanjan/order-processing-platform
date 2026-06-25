import React from 'react';
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import clsx from 'clsx';

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a2333] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md text-white text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></span>
          <p className="font-label-sm text-on-primary-container">{payload[0].name}</p>
        </div>
        <p className="font-bold mt-1 text-right">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const DonutChart = ({ 
  data, 
  height = 300,
  colors = DEFAULT_COLORS,
  showLegend = true,
  className 
}) => {
  return (
    <div className={clsx("w-full flex flex-col items-center", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-on-primary-container text-xs ml-1">{value}</span>}
            />
          )}
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
