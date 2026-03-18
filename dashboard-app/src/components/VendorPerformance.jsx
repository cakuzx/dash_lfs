import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export function VendorPerformance({ data }) {
  const chartData = useMemo(() => {
    const grouped = {};
    data.forEach(item => {
      const vendor = item.vendor;
      if (!vendor || vendor === 'Desconocido') return; // Saltar nulos/desconocidos
      
      if (!grouped[vendor]) {
        grouped[vendor] = { name: vendor, total: 0 };
      }
      grouped[vendor].total += (item.total || 0);
    });

    // Ordenar de mayor a menor y tomar los Top 5 o 10
    const result = Object.values(grouped)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8); // Top 8 vendedores

    return result;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
          <p className="font-semibold text-slate-700 text-sm mb-1">{label}</p>
          <div className="text-indigo-600 font-bold">
            $ {payload[0].value >= 1000000 ? (payload[0].value / 1000000).toFixed(2) + 'M' : payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 h-[450px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Top Vendedores</h3>
        <p className="text-sm text-slate-500">Rendimiento por ventas totales</p>
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
              <XAxis 
                type="number" 
                hide 
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }}
                width={100}
                tickFormatter={(val) => val.split(' ')[0]} // Mostrar solo el primer nombre
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="#6366f1" 
                radius={[0, 6, 6, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Sin datos
          </div>
        )}
      </div>
    </div>
  );
}
