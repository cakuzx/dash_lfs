import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Legend
} from 'recharts';

const PAYMENT_COLORS = {
  'CONTADO': '#6366f1',
  'CREDITO': '#f59e0b',
  'Desconocido': '#94a3b8',
};

export function TopClientsChart({ data, selectedClient }) {
  // Modo DETALLE: cuando hay un cliente seleccionado, muestra barras por año y tipo de pago
  const clientDetailData = useMemo(() => {
    if (!selectedClient || selectedClient === 'All') return null;

    const grouped = {};
    data.forEach(item => {
      if (item.client !== selectedClient) return;
      const year = item.year?.toString() || 'Sin año';
      const pType = item.paymentType || 'Desconocido';
      const key = `${pType} - ${year}`;
      
      if (!grouped[year]) grouped[year] = { year };
      grouped[year][pType] = (grouped[year][pType] || 0) + (Math.abs(item.total) || 0);
    });

    return Object.values(grouped).sort((a, b) => a.year.localeCompare(b.year));
  }, [data, selectedClient]);

  // Tipos de pago únicos disponibles en los datos del cliente seleccionado
  const paymentTypes = useMemo(() => {
    if (!clientDetailData) return [];
    const types = new Set();
    clientDetailData.forEach(row => Object.keys(row).forEach(k => { if (k !== 'year') types.add(k); }));
    return Array.from(types);
  }, [clientDetailData]);

  // Modo RANKING: Top 8 clientes
  const rankingData = useMemo(() => {
    if (selectedClient && selectedClient !== 'All') return [];
    const grouped = {};
    data.forEach(item => {
      const client = item.client;
      if (!client || client === 'Desconocido') return;
      if (!grouped[client]) grouped[client] = { name: client, total: 0 };
      grouped[client].total += Math.abs(item.total || 0);
    });
    return Object.values(grouped).sort((a, b) => b.total - a.total).slice(0, 8);
  }, [data, selectedClient]);

  const formatCurrency = (v) =>
    v >= 1000000 ? `S/ ${(v / 1000000).toFixed(2)}M` : `S/ ${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const CustomTooltipDetail = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl">
        <p className="font-bold text-slate-200 text-sm mb-2">Año {label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-bold text-white">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const CustomTooltipRanking = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl max-w-xs">
        <p className="font-semibold text-slate-200 text-sm mb-1 leading-tight">{label}</p>
        <div className="text-emerald-400 font-bold">{formatCurrency(payload[0].value)}</div>
      </div>
    );
  };

  const isDetailMode = selectedClient && selectedClient !== 'All';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/50 h-[450px] flex flex-col relative overflow-hidden group">
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 group-hover:bg-emerald-100/50 transition-colors"></div>
      
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">
          {isDetailMode ? `Historial de Compras` : 'Historial de Top Clientes'}
        </h3>
        <p className="text-sm text-slate-500">
          {isDetailMode
            ? <span className="text-indigo-600 font-medium truncate inline-block max-w-[400px]">{selectedClient}</span>
            : 'Volumen total de compras por cliente'}
        </p>
      </div>

      <div className="flex-1 w-full relative">
        {isDetailMode && clientDetailData?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientDetailData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(v) => v >= 1000000 ? `S/${(v/1000000).toFixed(1)}M` : v >= 1000 ? `S/${(v/1000).toFixed(0)}k` : v}
              />
              <Tooltip content={<CustomTooltipDetail />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                formatter={(val) => <span style={{ color: '#64748b' }}>{val}</span>}
              />
              {paymentTypes.map((type) => (
                <Bar 
                  key={type} 
                  dataKey={type} 
                  name={type}
                  fill={PAYMENT_COLORS[type] || '#64748b'}
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : !isDetailMode && rankingData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={rankingData} 
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
              <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.5 }} content={<CustomTooltipRanking />} />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={20}>
                {rankingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#34d399'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Sin datos disponibles
          </div>
        )}
      </div>
    </div>
  );
}
