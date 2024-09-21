import { CreditGetSchema, CreditInfoSchema, InvoiceGetSchema } from "@schemas/Payment";

import { z } from "zod";

export type CreditInfo = z.infer<typeof CreditInfoSchema>;
export type InvoiceGet = z.infer<typeof InvoiceGetSchema>;
export type CreditGet = z.infer<typeof CreditGetSchema>;
