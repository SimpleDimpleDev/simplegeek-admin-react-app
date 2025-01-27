import { MetricsChartsGetSchema, MetricsFilterSchema, MetricsSummaryGetSchema } from "@schemas/Metrics";

import { adminApi } from "./root";
import { z } from "zod";

const metricsApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		getMetricsCharts: build.query<z.infer<typeof MetricsChartsGetSchema>, z.infer<typeof MetricsFilterSchema>>({
			query: (params) => ({
				url: "/admin/metrics/charts",
				method: "GET",
				params,
			}),
			transformResponse: (response) => MetricsChartsGetSchema.parse(response),
		}),
		getMetricsSummary: build.query<z.infer<typeof MetricsSummaryGetSchema>, void>({
			query: () => ({
				url: "/admin/metrics/summary",
				method: "GET",
			}),
			transformResponse: (response) => MetricsSummaryGetSchema.parse(response),
		}),
	}),
});

export const { useGetMetricsChartsQuery, useGetMetricsSummaryQuery } = metricsApi;
