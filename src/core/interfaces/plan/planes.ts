
import { Image } from './interfaces';
import { Clinica } from './clinicas';

export interface HealthPlan {
    _id: string; // Coincide
    item_id?: string; // Opcional, si se usa
    linea?:string;
    // Datos principales
    name?: string; // Coincide
    empresa?: string; // Coincide
    sigla?: string; // Agregado para coincidir
    price: number; // Coincide
    precio: number; // **Corregido a number** (antes ReactNode)
    rating: number; // Coincide
    raiting: number; // Agregado para coincidir con el campo duplicado
    category?: 'inferior' | 'intermedio' | 'superior'; // Agregado

    // Atributos binarios (solo los más relevantes para un resumen)
    Sin_Copagos: boolean; // Agregado
    Habitacion_Individual: boolean; // Agregado
    copagos: boolean; // Agregado

    // Arrays anidados (corregido a singular Clinica, Image si es un único type)
    attributes: Attribute[]; // Coincide
    clinicas: Clinica[]; // **Corregido a Clinicas[]** para coincidir con el plural usado en Planes
    images: Image[]; // **Corregido a Imagen[]** para coincidir con el tipo usado en Planes
    
    // Arrays de strings
    folletos?: string[]; // Coincide (Planes tiene folletos en plural)
    beneficios?: string[]; // Agregado
}
// Angular: Attribute + campos adicionales mencionados
export interface Attribute {
    // Campos que ya estaban en Angular
    id: string | null;
    name: string;
    value_id: string | null;
    value_name: string;
    attribute_group_id: string | null;
    attribute_group_name: string;
    value_type: string | null;

    // Campos adicionales que mencionaste que existen
    attribute_group_order?: number | null; // Asegurar que acepte "" (string) o number, lo dejo como string | number
    attribute_name_order?: number | null; // Asegurar que acepte "" (string) o number
    display?: string;
    value?: string;
}