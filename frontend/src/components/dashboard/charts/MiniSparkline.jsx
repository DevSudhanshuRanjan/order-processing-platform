import React from 'react';
import { AreaChart as RechartsArea, Area, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const MiniSparkline = ({ 
  data, 
  yKey = 'value',
  color = '#10B981',
  height = 40,
  className 
}) => {
  // Add a unique ID for the gradient based on the color so multiple sparklines don't conflict
  const gradientId = `colorValue-${color.replace('#', '')}`;

  return (
    <div className={clsx("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsArea data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#${gradientId})`} 
            activeDot={false}
            isAnimationActive={false}
          />
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniSparkline;
