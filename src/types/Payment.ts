import { CreditGetSchema, CreditInfoGetSchema, InvoiceGetSchema, InvoiceStatusSchema } from "@schemas/Payment";

import { z } from "zod";

export type CreditInfo = z.infer<typeof CreditInfoGetSchema>;
export type InvoiceGet = z.infer<typeof InvoiceGetSchema>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;
export type CreditGet = z.infer<typeof CreditGetSchema>;
