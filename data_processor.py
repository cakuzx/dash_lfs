import pandas as pd
import json

def process_data(input_file, output_file):
    print(f"Leyendo archivo: {input_file}")
    df = pd.read_excel(input_file)
    
    # Seleccionar columnas relevantes y limpiar
    # AÑO, PERIODO, FECHA DE EMISION, CODIGO DE CLIENTE, CLIENTE, 
    # BASE IMPONIBLE SOLES8, IGV SOLES9, TOTAL SOLES10, VENDEDORES
    
    # Manejar posibles valores nulos
    df = df.fillna({
        'AÑO': 0,
        'PERIODO': 'Desconocido',
        'CLIENTE': 'Desconocido',
        'VENDEDORES': 'Desconocido',
        'TOTAL SOLES10': 0,
        'BASE IMPONIBLE SOLES8': 0,
        'IGV SOLES9': 0
    })
    
    # Convertir fechas a string si es necesario (para JSON)
    if 'FECHA DE EMISION' in df.columns:
        df['FECHA DE EMISION'] = df['FECHA DE EMISION'].astype(str)
        
    # Filtrar solo las columnas que necesitamos para el dashboard
    columns_to_keep = [
        'AÑO', 'PERIODO', 'CLIENTE', 'VENDEDORES', 
        'BASE IMPONIBLE', 'IGV', 'TOTAL', 'TIPO DE PAGO'
    ]
    
    # Verificar qué columnas existen
    available_columns = [col for col in columns_to_keep if col in df.columns]
    df_filtered = df[available_columns]
    
    # Renombrar columnas para que sean más amigables en JS
    rename_dict = {
        'AÑO': 'year',
        'PERIODO': 'period',
        'CLIENTE': 'client',
        'VENDEDORES': 'vendor',
        'BASE IMPONIBLE': 'base',
        'IGV': 'tax',
        'TOTAL': 'total',
        'TIPO DE PAGO': 'paymentType'
    }
    df_filtered = df_filtered.rename(columns=rename_dict)
    
    # Convertir a un formato de diccionario orientado a registros
    data_records = df_filtered.to_dict(orient='records')
    
    # Guardar a JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data_records, f, ensure_ascii=False, indent=2)
        
    print(f"Datos procesados y guardados en: {output_file}")
    print(f"Total de registros: {len(data_records)}")

if __name__ == "__main__":
    input_path = "Historial de compras.xlsx"
    output_path = "data.json"
    process_data(input_path, output_path)
