import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useGetMetricsChartsQuery, useGetMetricsSummaryQuery } from "@api/admin/metrics";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LineChart } from "@mui/x-charts";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

const chartProps = {
	grid: {
		vertical: true,
		horizontal: true,
	},
	margin: { left: 60, right: 30, top: 10, bottom: 30 },
	width: 1540,
	height: 280,
};

export default function IndexRoute() {
	const [date, setDate] = useState<dayjs.Dayjs>(dayjs());

	const {
		data: charts,
		isLoading: chartsIsLoading,
		isFetching: chartsIsFetching,
	} = useGetMetricsChartsQuery(
		{
			year: date.year(),
			month: date.month() + 1,
		},
		{ refetchOnMountOrArgChange: true }
	);
	const { data: summary, isLoading: summaryIsLoading } = useGetMetricsSummaryQuery();

	return (
		<>
			<LoadingOverlay isOpened={chartsIsFetching} />
			<div className="px-3 pt-1 pb-4 d-f fd-c" style={{ height: "100%" }}>
				<div className="p-2 d-f fd-r jc-sb">
					<Typography variant="h5">Главная</Typography>
				</div>
				<LoadingSpinner isLoading={summaryIsLoading}>
					{!summary ? (
						<div className="section">
							<Typography variant="subtitle0">Не удалось загрузить общие сведения</Typography>
						</div>
					) : (
						<div className="section" style={{ width: "fit-content" }}>
							<Typography variant="h6">Общие сведения</Typography>
							<div className="gap-2 d-f fd-c">
								<Typography>Необработанных заказов: {summary.ordersToProcess}</Typography>
								<Typography>Всего заказов: {summary.totalOrders}</Typography>
								<Typography>Общая выручка: {summary.totalIncome} ₽</Typography>
							</div>
						</div>
					)}
				</LoadingSpinner>

				<LoadingSpinner isLoading={chartsIsLoading}>
					{!charts ? (
						<div className="section">
							<Typography variant="subtitle0">Не удалось загрузить статистику</Typography>
						</div>
					) : (
						<div className="mt-2 section">
							<div className="gap-3 ai-c d-f fd-r">
								<Typography variant="h6">Статистика</Typography>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										label="Месяц"
										maxDate={dayjs()}
										openTo="month"
										views={["year", "month"]}
										value={date}
										onAccept={(date) => {
											if (date) setDate(date);
										}}
										sx={{ minWidth: 250 }}
									/>
								</LocalizationProvider>
							</div>
							<div className="gap-1 d-f fd-c">
								<Typography variant="subtitle0">Количество заказов</Typography>
								<LineChart
									{...chartProps}
									dataset={charts.orderQuantityDataSet}
									xAxis={[
										{
											id: "years",
											dataKey: "date",
											scaleType: "time",
											valueFormatter: (date) => dayjs(date).format("MM-DD"),
										},
									]}
									series={[
										{
											id: "series1",
											dataKey: "value",
										},
									]}
								/>
							</div>
							<div className="gap-1 d-f fd-c">
								<Typography variant="subtitle0">Выручка</Typography>
								<LineChart
									{...chartProps}
									dataset={charts.incomeDataSet}
									xAxis={[
										{
											id: "years",
											dataKey: "date",
											scaleType: "time",
											valueFormatter: (date) => dayjs(date).format("MM-DD"),
										},
									]}
									series={[
										{
											id: "series1",
											dataKey: "value",
										},
									]}
								/>
							</div>
						</div>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
