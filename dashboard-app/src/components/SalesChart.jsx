import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';

export function SalesChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = {};
    data.forEach(item => {
      const period = item.period;
      if (!period) return;
      if (!grouped[period]) {
        grouped[period] = { period, total: 0, base: 0 };
      }
      grouped[period].total += (item.total || 0);
      grouped[period].base += (item.base || 0);
    });
    return Object.values(grouped).sort((a, b) => String(a.period).localeCompare(String(b.period)));
  }, [data]);

  const fmt = (v) => {
    if (v >= 1000000) return `$ ${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000)    return `$ ${(v / 1000).toFixed(0)}k`;
    return `$ ${v}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
        <p className="font-semibold text-slate-700 mb-2 text-sm">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-medium text-slate-900">{fmt(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Mostrar máximo 12 etiquetas en el eje X para no saturar
  const tickInterval = Math.max(0, Math.floor(chartData.length / 12) - 1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 h-[450px] flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Evolución de Ventas</h3>
          <p className="text-sm text-slate-500">Tendencia histórica por periodo</p>
        </div>
        {/* Leyenda manual */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500" />
            Total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
            Base Imponible
          </span>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="period" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={tickInterval}
                dy={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={fmt}
                width={68}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="total" 
                name="Total"
                stroke="#4f46e5" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#4f46e5' }}
              />
              <Area 
                type="monotone" 
                dataKey="base" 
                name="Base Imponible"
                stroke="#10b981" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorBase)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No hay datos para mostrar en este periodo
          </div>
        )}
      </div>
    </div>
  );
}
