import React, { useMemo } from 'react';

export function Filters({ 
  years, vendors, clients, paymentTypes, selectedYear, selectedVendor, selectedClient, selectedPaymentType,
  setSelectedYear, setSelectedVendor, setSelectedClient, setSelectedPaymentType
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      <div className="flex flex-col gap-1 w-full lg:w-auto">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Año Fiscal
        </label>
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer w-full lg:min-w-[150px]"
          value={selectedYear} 
          onChange={e => setSelectedYear(e.target.value)}
        >
          {years.map(y => (
            <option key={y} value={y}>{y === 'All' ? 'Todos los Años' : y}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-full lg:w-auto">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Vendedor
        </label>
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer w-full lg:min-w-[200px]"
          value={selectedVendor} 
          onChange={e => setSelectedVendor(e.target.value)}
        >
          {vendors.map(v => (
            <option key={v} value={v}>{v === 'All' ? 'Todos los Vendedores' : v}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-full lg:w-auto min-w-[150px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Tipo Pago
        </label>
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer w-full"
          value={selectedPaymentType} 
          onChange={e => setSelectedPaymentType(e.target.value)}
        >
          {paymentTypes.map(p => (
            <option key={p} value={p}>{p === 'All' ? 'Todos los Tipos' : p}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-full lg:w-auto flex-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Cliente
        </label>
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer w-full"
          value={selectedClient} 
          onChange={e => setSelectedClient(e.target.value)}
        >
          {clients.map(c => (
            <option key={c} value={c}>{c === 'All' ? 'Todos los Clientes' : c}</option>
          ))}
        </select>
      </div>
      
      <div className="ml-auto w-full lg:w-auto flex items-center justify-end gap-2 mt-4 lg:mt-0">
        {(selectedYear !== 'All' || selectedVendor !== 'All' || selectedClient !== 'All' || selectedPaymentType !== 'All') && (
          <button 
            onClick={() => { 
                setSelectedYear('All'); 
                setSelectedVendor('All'); 
                setSelectedClient('All'); 
                setSelectedPaymentType('All');
            }}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100"
          >
            Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
}
