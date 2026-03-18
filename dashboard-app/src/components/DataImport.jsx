import React, { useRef, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';

export function DataImport({ onDataUpdate }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // Limpiar mensajes automáticamente después de 5 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          throw new Error('El archivo está vacío o no tiene el formato correcto.');
        }

        // Lógica de transformación similar a data_processor.py
        const processedData = jsonData.map(row => {
          // Mapear nombres de columnas (manejando variaciones comunes y el nuevo formato)
          const rawYear = row['AÑ'] || row['AÑO'] || row['Anio'] || row['Year'] || 0;
          const rawPeriod = row['PERIODO'] || row['Periodo'] || row['Month'] || 'Desconocido';
          
          return {
            year: Number(rawYear) || 0,
            period: String(rawPeriod),
            client: String(row['CLIENTE'] || row['Cliente'] || row['Customer'] || 'Desconocido'),
            vendor: String(row['VENDEDORES'] || row['Vendedor'] || row['Sales Rep'] || 'Desconocido'),
            base: Number(row['BASE IMPONIBLE'] || row['BASE IMPONIBLE SOLES8'] || row['Base'] || 0) || 0,
            tax: Number(row['IGV'] || row['IGV SOLES9'] || row['Tax'] || 0) || 0,
            total: Number(row['TOTAL'] || row['TOTAL SOLES10'] || row['Total'] || 0) || 0,
            paymentType: String(row['TIPO DE PAGO'] || row['Tipo de Pago'] || row['Payment'] || 'Desconocido')
          };
        });

        onDataUpdate(processedData);
        setSuccess(`¡Éxito! Se cargaron ${processedData.length} registros.`);
        
        // Limpiar input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error('Error procesando archivo:', err);
        setError('Error al procesar el archivo. Asegúrate de que sea un Excel o CSV válido.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Error al leer el archivo.');
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={triggerFileInput}
          disabled={isProcessing}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Upload size={20} />
          )}
          {isProcessing ? 'Procesando...' : 'Cargar Excel/CSV'}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <FileSpreadsheet size={14} />
          <span>Formatos soportados: .xlsx, .xls, .csv</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-100 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between gap-2 text-green-600 text-sm bg-green-50 p-2 rounded-md border border-green-100 animate-in fade-in duration-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
