import React, { useState, useMemo } from 'react';
import rawData from '../data.json';
import { SummaryCards } from './SummaryCards';
import { SalesChart } from './SalesChart';
import { VendorPerformance } from './VendorPerformance';
import { TopClientsChart } from './TopClientsChart';
import { Filters } from './Filters';
import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');
  const [selectedPaymentType, setSelectedPaymentType] = useState('All');

  const availableYears = useMemo(() => {
    const years = new Set(rawData.map(d => d.year).filter(y => y !== 0 && y !== null));
    return ['All', ...Array.from(years).sort()];
  }, []);

  const availableVendors = useMemo(() => {
    const vendors = new Set(rawData.map(d => d.vendor).filter(v => v !== 'Desconocido' && v !== null));
    return ['All', ...Array.from(vendors).sort()];
  }, []);

  const availableClients = useMemo(() => {
    const clients = new Set(rawData.map(d => d.client).filter(c => c !== 'Desconocido' && c !== null));
    return ['All', ...Array.from(clients).sort()];
  }, []);

  const availablePaymentTypes = useMemo(() => {
    const types = new Set(rawData.map(d => d.paymentType).filter(t => t && t !== ''));
    return ['All', ...Array.from(types).sort()];
  }, []);

  const filteredData = useMemo(() => {
    const result = rawData.filter(item => {
      const matchYear = selectedYear === 'All' || item.year.toString() === selectedYear.toString();
      const matchVendor = selectedVendor === 'All' || item.vendor === selectedVendor;
      const matchClient = selectedClient === 'All' || item.client === selectedClient;
      const matchPayment = selectedPaymentType === 'All' || item.paymentType === selectedPaymentType;
      return matchYear && matchVendor && matchClient && matchPayment;
    });
    console.log(`Filtered Data Length: ${result.length}`, {
      year: selectedYear, vendor: selectedVendor, client: selectedClient, payment: selectedPaymentType
    });
    return result;
  }, [selectedYear, selectedVendor, selectedClient, selectedPaymentType]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                LFS Sales Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {filteredData.length.toLocaleString()} Registros
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <Filters 
            years={availableYears}
            vendors={availableVendors}
            clients={availableClients}
            paymentTypes={availablePaymentTypes}
            selectedYear={selectedYear}
            selectedVendor={selectedVendor}
            selectedClient={selectedClient}
            selectedPaymentType={selectedPaymentType}
            setSelectedYear={setSelectedYear}
            setSelectedVendor={setSelectedVendor}
            setSelectedClient={setSelectedClient}
            setSelectedPaymentType={setSelectedPaymentType}
          />
        </section>

        <section>
          <SummaryCards data={filteredData} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SalesChart data={filteredData} />
          </div>
          <div className="lg:col-span-1">
            <VendorPerformance data={filteredData} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <TopClientsChart data={filteredData} selectedClient={selectedClient} />
          </div>
        </section>

      </main>
    </div>
  );
}
