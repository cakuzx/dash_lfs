import React, { useMemo } from 'react';
import { DollarSign, Percent, Users, Receipt } from 'lucide-react';

export function SummaryCards({ data }) {
  const metrics = useMemo(() => {
    let sales = 0;
    let base = 0;
    let tax = 0;
    const clients = new Set();
    const vendors = new Set();

    data.forEach(item => {
      sales += item.total || 0;
      base += item.base || 0;
      tax += item.tax || 0;
      if (item.client) clients.add(item.client);
      if (item.vendor) vendors.add(item.vendor);
    });

    // Calcular un margen aproximado o algún otro KPI
    // Aquí asumimos margen = base / total para demo (aunque sabemos que es IGV)
    // Mostraremos: 1. Total Ventas, 2. Base Imponible, 3. Clientes Únicos, 4. Promedio por Venta

    const avgSale = data.length > 0 ? sales / data.length : 0;

    return { sales, base, clientsCount: clients.size, avgSale };
  }, [data]);

  const cards = [
    {
      title: 'Ventas Totales',
      value: `S/ ${metrics.sales >= 1000000 ? (metrics.sales / 1000000).toFixed(2) + 'M' : (metrics.sales / 1000).toFixed(1) + 'k'}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      description: 'Ingresos totales con IGV'
    },
    {
      title: 'Base Imponible',
      value: `S/ ${metrics.base >= 1000000 ? (metrics.base / 1000000).toFixed(2) + 'M' : (metrics.base / 1000).toFixed(1) + 'k'}`,
      icon: Receipt,
      color: 'bg-blue-500',
      description: 'Ingresos netos sin IGV'
    },
    {
      title: 'Ticket Promedio',
      value: `S/ ${metrics.avgSale.toFixed(0)}`,
      icon: Percent,
      color: 'bg-purple-500',
      description: 'Por transacción'
    },
    {
      title: 'Clientes',
      value: metrics.clientsCount.toLocaleString(),
      icon: Users,
      color: 'bg-orange-500',
      description: 'Compradores únicos'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -z-10 group-hover:bg-slate-100 transition-colors"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </div>
            <div className={`${card.color} text-white p-3 rounded-xl shadow-sm`}>
              <card.icon size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
