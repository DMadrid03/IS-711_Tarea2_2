import { z } from 'zod';

const productSchema = z.object({
    "nombre": z.string().trim().min(3),
    "descripcion": z.string().trim().min(1),
    "precio": z.number(),
    "stock": z.number(),
    "categoria": z.enum(['pendiente', 'pagado', 'cancelado'], { required_error: "La categoria es requerida" , invalid_type_error: "La categoria debe ser pendiente, pagado o cancelado" }),
    "color": z.string().trim().min(1),
    "talla": z.string().trim().min(1).nullable(),
    "peso": z.number().min(0),
    "dimensiones": z.string().nullable()
});

export const validateProductSchema = (prod) => productSchema.safeParse(prod);
export const validatePartialSchema = (prod) => productSchema.partial().safeParse(prod);