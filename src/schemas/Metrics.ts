import { z } from "zod";

export const DataPointSchema = z.object({
	date: z.string().date().pipe(z.coerce.date()),
	value: z.number(),
});

export const MetricsFilterSchema = z.object({
	year: z.number(),
	month: z.number(),
});

export const MetricsChartsGetSchema = z.object({
	orderQuantityDataSet: DataPointSchema.array(),
	incomeDataSet: DataPointSchema.array(),
});

export const MetricsSummaryGetSchema = z.object({
	ordersToProcess: z.number(),
    totalOrders: z.number(),
	totalIncome: z.number(),
});
