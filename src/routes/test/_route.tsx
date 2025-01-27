import { Button, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LineChart } from "@mui/x-charts";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { MetricsChartsGetSchema } from "@schemas/Metrics";
import dayjs from "dayjs";
import { useState } from "react";

const dataStringList = [
	'{"orderQuantityDataSet":[{"date":"2024-12-10","value":7},{"date":"2024-12-11","value":2},{"date":"2024-12-12","value":1},{"date":"2024-12-13","value":5},{"date":"2024-12-14","value":1},{"date":"2024-12-15","value":4},{"date":"2024-12-16","value":2},{"date":"2024-12-17","value":1},{"date":"2024-12-19","value":5},{"date":"2024-12-20","value":2},{"date":"2024-12-22","value":1},{"date":"2024-12-23","value":1},{"date":"2024-12-25","value":1},{"date":"2024-12-26","value":6},{"date":"2024-12-27","value":2},{"date":"2024-12-28","value":1},{"date":"2024-12-29","value":6}],"incomeDataSet":[{"date":"2024-12-10","value":56600},{"date":"2024-12-11","value":9900},{"date":"2024-12-12","value":7300},{"date":"2024-12-13","value":26400},{"date":"2024-12-14","value":3300},{"date":"2024-12-15","value":56700},{"date":"2024-12-16","value":13200},{"date":"2024-12-17","value":3300},{"date":"2024-12-19","value":16500},{"date":"2024-12-20","value":9900},{"date":"2024-12-22","value":3300},{"date":"2024-12-23","value":3300},{"date":"2024-12-25","value":3900},{"date":"2024-12-26","value":24490},{"date":"2024-12-27","value":7690},{"date":"2024-12-28","value":1690},{"date":"2024-12-29","value":22040}]}',
	'{"orderQuantityDataSet":[{"date":"2025-01-07","value":1},{"date":"2025-01-08","value":1},{"date":"2025-01-10","value":1},{"date":"2025-01-12","value":5},{"date":"2025-01-15","value":2},{"date":"2025-01-16","value":7},{"date":"2025-01-17","value":1},{"date":"2025-01-18","value":2},{"date":"2025-01-22","value":1}],"incomeDataSet":[{"date":"2025-01-07","value":3300},{"date":"2025-01-08","value":6000},{"date":"2025-01-10","value":6600},{"date":"2025-01-12","value":25220},{"date":"2025-01-15","value":5880},{"date":"2025-01-16","value":50950},{"date":"2025-01-17","value":3380},{"date":"2025-01-18","value":7970},{"date":"2025-01-22","value":5170}]}',
];

const chartProps = {
	grid: {
		vertical: true,
		horizontal: true,
	},
	margin: { left: 60, right: 30, top: 10, bottom: 30 },
	width: 1540,
	height: 280,
};

export default function TestRoute() {
	const [selectedDataIndex, setSelectedDataIndex] = useState(0);
	const charts = MetricsChartsGetSchema.parse(JSON.parse(dataStringList[selectedDataIndex]));
	const [chartsLoading, setChartsLoading] = useState(false);

	const handleChangeData = () => {
		setChartsLoading(true);
		setSelectedDataIndex((index) => (index + 1) % dataStringList.length);
		setTimeout(() => setChartsLoading(false), 1000);
	};
	console.log(charts);
	return (
		<>
			<Button onClick={() => handleChangeData()}>
				{chartsLoading ? "Загрузка..." : "Обновить"}	
			</Button>
			{!charts ? (
				<div className="section">
					<Typography variant="subtitle0">Не удалось загрузить статистику</Typography>
				</div>
			) : (
				<LoadingSpinner isLoading={chartsLoading}>
					<div className="mt-2 section">
						<div className="gap-3 ai-c d-f fd-r">
							<Typography variant="h6">Статистика</Typography>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label="Месяц"
									maxDate={dayjs()}
									openTo="month"
									views={["year", "month"]}
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
										scaleType: "utc",
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
										scaleType: "utc",
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
				</LoadingSpinner>
			)}
		</>
	);
}
