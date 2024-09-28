import { z } from "zod";

export const IdSchema = z.string().uuid() 

export const ISOToDateSchema = z.string().datetime().pipe( z.coerce.date() );

export const SlugScheme = z.string().regex(/^[a-zA-Z0-9-_а-яА-ЯёЁ]+$/);
