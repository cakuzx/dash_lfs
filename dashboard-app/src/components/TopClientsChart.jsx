import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export function TopClientsChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = {};
    data.forEach(item => {
      const client = item.client;
      if (!client || client === 'Desconocido') return;
      
      if (!grouped[client]) {
        grouped[client] = { name: client, total: 0 };
      }
      grouped[client].total += (item.total || 0);
    });

    // Top 8 clientes
    const result = Object.values(grouped)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    return result;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl max-w-xs">
          <p className="font-semibold text-slate-200 text-sm mb-1 leading-tight">{label}</p>
          <div className="text-emerald-400 font-bold">
            S/ {payload[0].value >= 1000000 ? (payload[0].value / 1000000).toFixed(2) + 'M' : payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 h-[450px] flex flex-col relative overflow-hidden group">
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 group-hover:bg-emerald-100/50 transition-colors"></div>
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Historial de Top Clientes</h3>
        <p className="text-sm text-slate-500">Volumen total de compras por cliente</p>
      </div>

      <div className="flex-1 w-full relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              layout="vertical"
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10 }}
                width={140}
                tickFormatter={(val) => val.length > 20 ? val.substring(0, 20) + '...' : val}
              />
              <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.5 }} content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                radius={[0, 6, 6, 0]} 
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#34d399'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Sin datos o filtro muy específico
          </div>
        )}
      </div>
    </div>
  );
}
