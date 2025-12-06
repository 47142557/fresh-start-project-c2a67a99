export interface Ubicacion {
    direccion: string;
    telefono?: string; // ⚠️ CORRECCIÓN: Ahora es Opcional
    barrio: string;
    partido: string;
    region: string;
    provincia: string;
    CP: string;
}

export interface Image {
  id: string;
  descripcion: string;
  empresa: string;
  url: string;
}