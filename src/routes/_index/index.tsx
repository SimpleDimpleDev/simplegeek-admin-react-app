import { LineChart } from "@mui/x-charts";
import { Typography } from "@mui/material";

export default function IndexRoute() {
	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<Typography variant="h4" component="h1" sx={{ mb: 2 }}>
				ADMIN
			</Typography>

			<div className="bg-primary p-2 w-mc br-2 d-f fd-c">
				<Typography variant="h5" component="h2" sx={{ mb: 2 }}>
					Осмысленное качество кода ко дню релиза
				</Typography>
				<div style={{ width: 800, maxWidth: 800, height: 800, margin: 0 }}>
					<LineChart
						xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
						series={[
							{
								data: [2, 5.5, 2, 8.5, 1.5, 5],
							},
						]}
						width={500}
						height={300}
					/>
				</div>
			</div>
		</div>
	);
}
