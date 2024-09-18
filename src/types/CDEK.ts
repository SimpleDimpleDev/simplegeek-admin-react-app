import {
	CDEKAddressSchema,
	CDEKDeliveryDataFullSchema,
	CDEKDeliveryTypeSchema,
	CDEKDoorAddressSchema,
	CDEKOfficeAddressSchema,
	CDEKTariffSchema,
} from "@schemas/CDEK";

import { z } from "zod";

export type CDEKDeliveryType = z.infer<typeof CDEKDeliveryTypeSchema>;
export type CDEKDoorAddress = z.infer<typeof CDEKDoorAddressSchema>;
export type CDEKOfficeAddress = z.infer<typeof CDEKOfficeAddressSchema>;
export type CDEKAddress = z.infer<typeof CDEKAddressSchema>;
export type CDEKTariff = z.infer<typeof CDEKTariffSchema>;
export type CDEKDeliveryData = z.infer<typeof CDEKDeliveryDataFullSchema>;
